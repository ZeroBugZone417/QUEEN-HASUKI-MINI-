/**
 * QUEEN-HASUKI MINI Main Server + WhatsApp Bot
 * Copyright © 2025 Zero Bug Zone
 * Owner: DINETH SUDARSHANA
 */

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');
const chalk = require('chalk');

const config = require('./config');
const { connectDatabase } = require('./database/connection');
const { generalLimiter } = require('./middleware/rateLimiter');
const { loadPlugins } = require('./plugins/bot'); // Plugin loader

// ===== EXPRESS SERVER =====
const app = express();
app.set('trust proxy', 1);

const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET","POST"] } });

// ===== MIDDLEWARE =====
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// ===== STATIC FILES =====
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ===== API ROUTES =====
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bot', require('./routes/bot'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

// Serve main page
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

// 404 & error handling
app.use('*', (req, res) => res.status(404).json({ success: false, message: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error(chalk.red('Server Error:'), err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ===== SOCKET.IO REAL-TIME =====
global.io = io;
io.on('connection', socket => {
  console.log(chalk.blue('Client connected:'), socket.id);
  socket.on('disconnect', () => console.log(chalk.yellow('Client disconnected:'), socket.id));
});

// ===== WHATSAPP BOT =====
const prefix = '.';
const ownerNumber = ['94789737967']; // Your owner number
const credsFolder = path.join(__dirname, 'auth_info_baileys');

if (!global.commands) global.commands = [];

let botInstance = null; // Prevent multiple instances

async function startBot() {
  if (botInstance) return botInstance;

  try {
    const baileys = await import('@whiskeysockets/baileys');
    const makeWASocket = baileys.default;
    const {
      useMultiFileAuthState,
      getContentType,
      fetchLatestBaileysVersion,
      DisconnectReason,
      Browsers
    } = baileys;

    const { state, saveCreds } = await useMultiFileAuthState(credsFolder);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
      logger: { level: 'silent' },
      printQRInTerminal: true,
      browser: Browsers.macOS('Firefox'),
      auth: state,
      version,
      syncFullHistory: true
    });

    botInstance = sock;

    sock.ev.on('connection.update', async update => {
      const { connection, lastDisconnect } = update;
      if (connection === 'close') {
        const code = lastDisconnect?.error?.output?.statusCode;
        console.log(chalk.red('❌ Disconnected from WhatsApp, code:'), code);

        if (code !== DisconnectReason.loggedOut) {
          console.log(chalk.yellow('🔄 Reconnecting in 5s...'));
          setTimeout(startBot, 5000);
        } else {
          console.error('❌ Logged out from WhatsApp. Delete auth folder to relogin.');
        }
      } else if (connection === 'open') {
        console.log(chalk.green('✅ Bot connected to WhatsApp'));
        try {
          loadPlugins();

          // ===== Notify owner =====
          for (let owner of ownerNumber) {
            await sock.sendMessage(owner + '@s.whatsapp.net', { 
              text: '✅ QUEEN-HASUKI MINI is now online!' 
            });
          }

        } catch (err) {
          console.error('❌ Plugin loading error:', err);
        }
      }
    });

    sock.ev.on('creds.update', saveCreds);

    // Messages handler
    sock.ev.on('messages.upsert', async ({ messages }) => {
      if (!messages || !messages.length) return;
      const mek = messages[0];
      if (!mek?.message || mek.key.remoteJid === 'status@broadcast') return;

      mek.message = getContentType(mek.message) === 'ephemeralMessage'
        ? mek.message.ephemeralMessage.message
        : mek.message;

      const type = getContentType(mek.message);
      const from = mek.key.remoteJid;
      const body =
        type === 'conversation'
          ? mek.message.conversation
          : mek.message[type]?.text || mek.message[type]?.caption || '';

      if (!body.startsWith(prefix)) return;

      const commandName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
      const args = body.trim().split(/ +/).slice(1);
      const q = args.join(' ');

      const sender = mek.key.fromMe ? sock.user.id : (mek.key.participant || mek.key.remoteJid);
      const isOwner = ownerNumber.includes((sender || '').split('@')[0]);
      const reply = text => sock.sendMessage(from, { text }, { quoted: mek });

      const cmd = global.commands.find(c => c.pattern.toLowerCase() === commandName.toLowerCase());
      if (cmd) {
        try {
          await cmd.function(sock, mek, { from, body, args, q, isOwner, reply });
        } catch (err) {
          console.error('[PLUGIN ERROR]', err);
          await reply('❌ Error executing command');
        }
      }
    });

    return sock;
  } catch (err) {
    console.error(chalk.red('❌ Bot initialization failed:'), err);
  }
}

// ===== START SERVER =====
const startServer = async () => {
  try {
    await connectDatabase();
    console.log(chalk.green('✅ Database connected'));

    await startBot();

    const PORT = config.PORT || 8000;
    server.listen(PORT, () =>
      console.log(chalk.green(`QUEEN-HASUKI MINI running at http://localhost:${PORT}`))
    );
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
