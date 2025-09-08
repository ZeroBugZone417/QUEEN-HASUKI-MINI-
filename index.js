/**
 * QUEEN-MINI Main Server + WhatsApp Bot
 * Copyright © 2025 DarkSide Developers
 * Owner: Dineth Sudarshana
 * GitHub: https://github.com/ZeroBugZone417
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');

const {
  default: makeWASocket,
  useMultiFileAuthState,
  jidNormalizedUser,
  getContentType,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');

const config = require('./config');
const { connectDatabase } = require('./database/connection');
const { generalLimiter } = require('./middleware/rateLimiter');
const { getGroupAdmins, sms } = require('./lib/functions');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

// Global middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bot', require('./routes/bot'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

// Serve main application
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use((error, req, res, next) => {
  console.error(chalk.red('Server Error:'), error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// =======================
// ===== BOT SETUP =======
// =======================
const prefix = '.';
const ownerNumber = ['94789737967'];
const credsFolder = path.join(__dirname, 'auth_info_baileys');
const credsPath = path.join(credsFolder, 'creds.json');

// ===== Manual commands registration =====
global.commands = [
    { pattern: 'alive', function: require('./plugins/alive') },
    { pattern: 'ping', function: require('./plugins/ping') },
    { pattern: 'owner', function: require('./plugins/owner') },
    { pattern: 'botinfo', function: require('./plugins/botinfo') },
];

// ===== Dynamic plugin loader =====
const loadPlugins = () => {
  const pluginDir = path.join(__dirname, 'plugins');
  if (!fs.existsSync(pluginDir)) return;

  fs.readdirSync(pluginDir).forEach(file => {
    if (file.endsWith('.js')) {
      const cmdPattern = path.basename(file, '.js');
      if (!global.commands.find(c => c.pattern === cmdPattern)) {
        try {
          const cmd = require(`./plugins/${file}`);
          global.commands.push({ pattern: cmdPattern, function: cmd });
          console.log(`✅ Loaded plugin: ${file}`);
        } catch (err) {
          console.error(`❌ Failed to load plugin: ${file}`, err);
        }
      }
    }
  });
};

// ===== WhatsApp Connection =====
async function connectToWA() {
  try {
    console.log('🔄 Connecting QUEEN HASUKI bot...');
    const { state, saveCreds } = await useMultiFileAuthState(credsFolder);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      logger: { level: 'silent' },
      printQRInTerminal: true,
      browser: Browsers.macOS('Firefox'),
      auth: state,
      version,
      syncFullHistory: true,
      markOnlineOnConnect: true,
      generateHighQualityLinkPreview: true
    });

    sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        if (code !== DisconnectReason.loggedOut) connectToWA();
        else console.error('❌ Logged out from WhatsApp. Delete auth folder to relogin.');
      } else if (connection === 'open') {
        console.log('✅ QUEEN HASUKI connected to WhatsApp');

        // ===== Stylish Owner Notification =====
        try {
          const notifyMsg = `
╔════════════════════════════╗
        👑 *QUEEN HASUKI* 👑
╠════════════════════════════╣
🟢 Status: *Connected & Online*
⏰ Time: ${new Date().toLocaleString()}

📌 Owner: +${ownerNumber[0]}
⚡ Prefix: ${prefix}
🤖 Bot: *QUEEN HASUKI v2.0.0*

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*
📍 GitHub: https://github.com/ZeroBugZone417
╚════════════════════════════╝
          `;
          await sock.sendMessage(ownerNumber[0] + '@s.whatsapp.net', { text: notifyMsg });
          console.log('📩 Owner notified successfully!');
        } catch (err) {
          console.warn('⚠️ Failed to notify owner:', err?.message);
        }

        // Load plugins
        loadPlugins();
      }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
      if (!messages || !messages.length) return;
      const mek = messages[0];
      if (!mek?.message || mek.key.remoteJid === 'status@broadcast') return;

      mek.message = getContentType(mek.message) === 'ephemeralMessage'
        ? mek.message.ephemeralMessage.message
        : mek.message;

      const type = getContentType(mek.message);
      const from = mek.key.remoteJid;
      const body = type === 'conversation'
        ? mek.message.conversation
        : mek.message[type]?.text || mek.message[type]?.caption || '';
      if (!body.startsWith(prefix)) return;

      const commandName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(' ');

      const sender = mek.key.fromMe ? sock.user.id : (mek.key.participant || mek.key.remoteJid);
      const isOwner = ownerNumber.includes((sender || '').split('@')[0]);

      const reply = text => sock.sendMessage(from, { text }, { quoted: mek });

      // Run command if exists
      const cmd = global.commands.find(c => c.pattern === commandName);
      if (cmd) {
        try {
          await cmd.function(sock, mek, { from, body, args, q, isOwner, reply, bot: { botName: 'QUEEN HASUKI', BOT_VERSION: '2.0.0' } });
        } catch (err) {
          console.error('[PLUGIN ERROR]', err);
          await reply('❌ Error executing command');
        }
      }
    });

    return sock;
  } catch (err) {
    console.error('❌ WhatsApp connection error:', err);
  }
}

// =======================
// ===== Start Server =====
// =======================
const startServer = async () => {
  try {
    await connectDatabase();
    await connectToWA();

    const PORT = config.PORT || 8000;
    server.listen(PORT, () => {
      console.log(chalk.green(`QUEEN-MINI Server running at http://localhost:${PORT}`));
    });
  } catch (err) {
    console.error(chalk.red('Failed to start server:'), err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));

startServer();

module.exports = app;
