/**
 * QUEEN-MINI Main Server
 * Copyright © 2025 DarkSide Developers
 * Owner: DarkWinzo
 * GitHub: https://github.com/DarkWinzo
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
const chokidar = require('chokidar'); // 🔌 for hot reload support

const config = require('./config');
const { connectDatabase } = require('./database/connection');
const { generalLimiter } = require('./middleware/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const botRoutes = require('./routes/bot');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Global middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalLimiter);

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO for real-time updates
global.io = io;

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/bot', botRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Serve main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((error, req, res, next) => {
    console.error(chalk.red('Server Error:'), error);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log(chalk.blue('Client connected:'), socket.id);
    
    socket.on('disconnect', () => {
        console.log(chalk.yellow('Client disconnected:'), socket.id);
    });
});

/* ===========================================================
   🔌 QUEEN-MINI Plugin Loader (Auto Reload System)
   =========================================================== */
const pluginsPath = path.join(__dirname, 'plugins');
global.plugins = new Map();

function loadPlugin(file) {
    const pluginPath = path.join(pluginsPath, file);
    try {
        delete require.cache[require.resolve(pluginPath)];
        const plugin = require(pluginPath);
        global.plugins.set(file, plugin);

        // Auto-run plugin if it has run() function
        if (typeof plugin.run === 'function') {
            plugin.run(io, app);
        }

        console.log(chalk.green(`✅ Loaded plugin: ${file}`));
    } catch (err) {
        console.error(chalk.red(`❌ Failed to load plugin: ${file}`), err);
    }
}

function unloadPlugin(file) {
    if (global.plugins.has(file)) {
        global.plugins.delete(file);
        console.log(chalk.yellow(`⚠️ Unloaded plugin: ${file}`));
    }
}

function loadAllPlugins() {
    if (!fs.existsSync(pluginsPath)) {
        fs.mkdirSync(pluginsPath);
        console.log(chalk.yellow('⚠️ Plugins folder created (was missing).'));
    }

    const files = fs.readdirSync(pluginsPath).filter(f => f.endsWith('.js'));
    files.forEach(loadPlugin);

    console.log(chalk.cyan(`🔌 Total plugins loaded: ${global.plugins.size}`));
}

// Initial load
loadAllPlugins();

// 👀 Watch for plugin file changes (Hot Reload)
chokidar.watch(pluginsPath, { ignoreInitial: true })
    .on('add', file => {
        if (file.endsWith('.js')) loadPlugin(path.basename(file));
    })
    .on('change', file => {
        if (file.endsWith('.js')) {
            unloadPlugin(path.basename(file));
            loadPlugin(path.basename(file));
            console.log(chalk.blue(`♻️ Reloaded plugin: ${path.basename(file)}`));
        }
    })
    .on('unlink', file => {
        if (file.endsWith('.js')) unloadPlugin(path.basename(file));
    });

/* ===========================================================
   🚀 Start Server
   =========================================================== */
const startServer = async () => {
    try {
        await connectDatabase();
        
        const PORT = config.PORT;
        server.listen(PORT, () => {
            console.log(chalk.green(`
╔══════════════════════════════════════════════════════════════╗
║                        QUEEN-MINI v${config.APP_VERSION}                        ║
║                  Advanced WhatsApp Bot System                 ║
║                                                              ║
║  🚀 Server running on: http://localhost:${PORT}                ║
║  📊 Database: Connected                                      ║
║  🔒 Security: Enabled                                        ║
║  ⚡ Real-time: Socket.IO Active                             ║
║  🔌 Plugins: ${global.plugins.size} Loaded                           ║
║                                                              ║
║  Copyright © ${config.COPYRIGHT.YEAR} ${config.COPYRIGHT.COMPANY}                    ║
║  Owner: ${config.COPYRIGHT.OWNER}                                      ║
║  GitHub: ${config.COPYRIGHT.GITHUB}                ║
╚══════════════════════════════════════════════════════════════╝
            `));
        });
    } catch (error) {
        console.error(chalk.red('Failed to start server:'), error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log(chalk.yellow('SIGTERM received, shutting down gracefully...'));
    server.close(() => {
        console.log(chalk.green('Server closed'));
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    console.log(chalk.yellow('SIGINT received, shutting down gracefully...'));
    server.close(() => {
        console.log(chalk.green('Server closed'));
        process.exit(0);
    });
});

startServer();

module.exports = app;
