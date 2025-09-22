/**
 * Bot Service (Updated)
 * Copyright © 2025 DarkSide Developers
 */

const {
    default: makeWASocket,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers,
    jidNormalizedUser,
    getContentType
} = require('@whiskeysockets/baileys');
const fs = require('fs-extra');
const path = require('path');
const pino = require('pino');
const { Bot } = require('../database/models');

const activeSockets = new Map();
const SESSION_BASE_PATH = './sessions';

// Ensure session directory exists
fs.ensureDirSync(SESSION_BASE_PATH);

// Create bot session
const createBotSession = async (bot, method = 'pair') => {
    try {
        const sessionPath = path.join(SESSION_BASE_PATH, `session_${bot.id}`);
        const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
        const logger = pino({ level: 'silent' });

        const socket = makeWASocket({
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, logger),
            },
            logger,
            browser: Browsers.macOS('Safari'),
            version: (await import('@whiskeysockets/baileys')).fetchLatestBaileysVersion(),
            syncFullHistory: true
        });

        activeSockets.set(bot.id, socket);

        // Connection updates & QR handling
        socket.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr && method === 'qr') {
                global.io.emit('bot_qr', { botId: bot.id, qr });
            }

            if (connection === 'open') {
                await bot.update({ status: 'connected', lastSeen: new Date() });
                global.io.emit('bot_status_update', { botId: bot.id, status: 'connected' });
                console.log(`✅ Bot ${bot.id} connected`);
            } else if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
                await bot.update({ status: shouldReconnect ? 'connecting' : 'disconnected' });
                activeSockets.delete(bot.id);

                if (shouldReconnect) {
                    console.log(`🔄 Bot ${bot.id} disconnected, reconnecting in 5s...`);
                    setTimeout(() => createBotSession(bot), 5000);
                } else {
                    console.error(`❌ Bot ${bot.id} logged out, delete session folder to relogin`);
                }
            }
        });

        socket.ev.on('creds.update', saveCreds);

        // Setup message & button handlers
        setupMessageHandlers(socket, bot);

        if (method === 'pair' && !socket.authState.creds.registered) {
            let retries = 3;
            let code;
            while (retries > 0) {
                try {
                    await delay(1500);
                    code = await socket.requestPairingCode(bot.phoneNumber);
                    break;
                } catch (error) {
                    retries--;
                    console.warn(`Pairing code request failed: ${error.message}, retries left: ${retries}`);
                    await delay(2000);
                }
            }
            return code;
        }

        return method === 'qr' ? 'QR_GENERATED' : 'SESSION_CREATED';
    } catch (error) {
        console.error('Create bot session error:', error);
        throw error;
    }
};

// Setup message handlers
const setupMessageHandlers = (socket, bot) => {
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

        try {
            const stats = bot.statistics || {};
            stats.messagesReceived = (stats.messagesReceived || 0) + 1;
            await bot.update({ statistics: stats });

            const type = getContentType(msg.message);
            const text =
                type === 'conversation'
                    ? msg.message.conversation
                    : msg.message[type]?.text || msg.message[type]?.caption || '';

            if (!text.startsWith(bot.settings.prefix || '.')) return;

            const cmdName = text.slice((bot.settings.prefix || '.').length).split(' ')[0].toLowerCase();
            await executeCommand(socket, msg, cmdName, bot);

            stats.commandsExecuted = (stats.commandsExecuted || 0) + 1;
            await bot.update({ statistics: stats });
        } catch (err) {
            console.error('Message handler error:', err);
        }
    });

    // Button response handling
    socket.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        const type = getContentType(msg.message);
        if (type !== 'buttonsResponseMessage') return;

        const buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
        const from = msg.key.remoteJid;

        if (buttonId === 'contact_owner') {
            await socket.sendMessage(from, {
                text: '📞 You can contact the owner at +94789737967'
            }, { quoted: msg });
        }
    });
};

// Execute command
const executeCommand = async (socket, msg, cmdName, bot) => {
    try {
        const commandPath = path.join(__dirname, '..', 'plugins', `${cmdName}.js`);
        if (fs.existsSync(commandPath)) {
            delete require.cache[require.resolve(commandPath)];
            const command = require(commandPath);
            if (typeof command === 'function') {
                await command(socket, msg, bot);
            }
        }
    } catch (error) {
        console.error(`Command execution error for ${cmdName}:`, error);
    }
};

// Bot utility functions
const getBotStatus = (botId) => {
    const socket = activeSockets.get(botId);
    if (!socket) return { status: 'disconnected', online: false };
    return { status: 'connected', online: true, user: socket.user, lastSeen: new Date() };
};

const updateBotSettings = (botId, settings) => {
    const socket = activeSockets.get(botId);
    if (socket) {
        console.log(`Updated settings for bot ${botId}:`, settings);
        global.io.emit('bot_settings_update', { botId, settings });
    }
};

const disconnectBot = async (botId) => {
    const socket = activeSockets.get(botId);
    if (socket) {
        socket.ws.close();
        activeSockets.delete(botId);
        await Bot.update({ status: 'disconnected' }, { where: { id: botId } });
    }
};

module.exports = {
    createBotSession,
    getBotStatus,
    updateBotSettings,
    disconnectBot
};
