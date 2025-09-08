/**
 * QUEEN-MINI Main Server + WhatsApp Bot
 * Copyright © 2025 DarkSide Developers
 * Owner: DarkWinzo
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
  getContentType,
  fetchLatestBaileysVersion,
  DisconnectReason,
  Browsers
} = require('@whiskeysockets/baileys');

const config = require('./config');
const { connectDatabase } = require('./database/connection');
const { generalLimiter } = require('./middleware/rateLimiter');
const { loadPlugins } = require('./bot'); // Plugin loader

// ===== EXPRESS SERVER =====
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*", methods: ["GET","POST"] } });

// Middleware
app.use(helmet({ contentSecurityPolicy:false, crossOriginEmbedderPolicy:false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit:'10mb' }));
app.use(express.urlencoded({ extended:true, limit:'10mb' }));
app.use(generalLimiter);

// Static
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/bot', require('./routes/bot'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/user', require('./routes/user'));

// Serve main page
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));

// 404 & error
app.use('*', (req,res)=>res.status(404).json({ success:false, message:'Route not found' }));
app.use((err, req,res,next)=> {
  console.error(chalk.red('Server Error:'), err);
  res.status(500).json({ success:false, message:'Internal server error' });
});

// Socket.IO for real-time
global.io = io;
io.on('connection', socket=>{
  console.log(chalk.blue('Client connected:'), socket.id);
  socket.on('disconnect', ()=> console.log(chalk.yellow('Client disconnected:'), socket.id));
});

// ===== WHATSAPP BOT =====
const prefix = '.';
const ownerNumber = ['94789737967'];
const credsFolder = path.join(__dirname,'auth_info_baileys');

// Initialize global commands
if(!global.commands) global.commands = [];

async function startBot(){
  const { state, saveCreds } = await useMultiFileAuthState(credsFolder);
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    logger:{ level:'silent' },
    printQRInTerminal:true,
    browser:Browsers.macOS('Firefox'),
    auth:state,
    version,
    syncFullHistory:true
  });

  sock.ev.on('connection.update', async update=>{
    const { connection, lastDisconnect } = update;
    if(connection==='close'){
      const code = lastDisconnect?.error?.output?.statusCode;
      if(code !== DisconnectReason.loggedOut) startBot();
      else console.error('❌ Logged out from WhatsApp, delete auth folder to relogin.');
    } else if(connection==='open'){
      console.log('✅ Bot connected');
      // Load all plugins after bot connects
      loadPlugins();
    }
  });

  sock.ev.on('creds.update', saveCreds);

  // Messages handler
  sock.ev.on('messages.upsert', async ({messages})=>{
    if(!messages || !messages.length) return;
    const mek = messages[0];
    if(!mek?.message || mek.key.remoteJid==='status@broadcast') return;

    mek.message = getContentType(mek.message)==='ephemeralMessage' ? mek.message.ephemeralMessage.message : mek.message;
    const type = getContentType(mek.message);
    const from = mek.key.remoteJid;
    const body = type==='conversation' ? mek.message.conversation : mek.message[type]?.text || mek.message[type]?.caption || '';
    if(!body.startsWith(prefix)) return;

    const commandName = body.slice(prefix.length).trim().split(' ')[0].toLowerCase();
    const args = body.trim().split(/ +/).slice(1);
    const q = args.join(' ');

    const sender = mek.key.fromMe ? sock.user.id : (mek.key.participant || mek.key.remoteJid);
    const isOwner = ownerNumber.includes((sender||'').split('@')[0]);
    const reply = text => sock.sendMessage(from,{ text },{ quoted: mek });

    const cmd = global.commands.find(c=>c.pattern===commandName);
    if(cmd){
      try{ await cmd.function(sock, mek, { from, body, args, q, isOwner, reply }); }
      catch(err){ console.error('[PLUGIN ERROR]', err); await reply('❌ Error executing command'); }
    }
  });

  return sock;
}

// ===== START SERVER =====
const startServer = async ()=>{
  try{
    await connectDatabase();
    await startBot();

    const PORT = config.PORT || 8000;
    server.listen(PORT, ()=> console.log(chalk.green(`QUEEN-MINI running at http://localhost:${PORT}`)));
  }catch(err){
    console.error(chalk.red('Failed to start server:'), err);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGTERM', ()=>server.close(()=>process.exit(0)));
process.on('SIGINT', ()=>server.close(()=>process.exit(0)));

startServer();

module.exports = app;

