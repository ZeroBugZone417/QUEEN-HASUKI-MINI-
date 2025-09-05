/**
 * QUEEN-HASUKI Configuration
 * Copyright © 2025 Zero Bug Zone
 * Owner: Dineth Sudarshana
 * GitHub: https://github.com/zerobugzone
 */

module.exports = {
    // Application Settings
    APP_NAME: 'QUEEN-HASUKI MINI',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'Advanced WhatsApp Bot Management System',
    
    // Server Configuration
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    DATABASE_URL: process.env.DATABASE_URL || "local",
    
    // JWT Configuration
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRES_IN: '7d',
    
    // Email Configuration
    EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
    EMAIL_PORT: process.env.EMAIL_PORT || 587,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASS: process.env.EMAIL_PASS,
    EMAIL_FROM: process.env.EMAIL_FROM || 'QUEEN-HASUKI <noreply@queen-hasuki.com>',
    
    // WhatsApp Bot Configuration
    BOT_NAME: 'QUEEN HASUKI',
    BOT_VERSION: '2.0.0',
    BOT_FOOTER: '© 2025 Zero Bug Zone',
    PREFIX: process.env.PREFIX || '.',
    
    // Admin Configuration
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    
    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000,
    RATE_LIMIT_MAX: 100,
    
    // File Upload
    MAX_FILE_SIZE: 10 * 1024 * 1024,
    UPLOAD_PATH: './uploads',
    
    // Bot Settings
    AUTO_VIEW_STATUS: true,
    AUTO_LIKE_STATUS: true,
    AUTO_RECORDING: true,
    AUTO_LIKE_EMOJI: ['🧩', '🍉', '💜', '🌸', '🪴', '💊', '💫', '🍂', '🌟', '🎋'],
    MAX_RETRIES: 3,
    
    // GitHub Integration
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER || 'zerobugzone',
    GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME || 'queen-hasuki',
    
    // Copyright Information
    COPYRIGHT: {
        COMPANY: 'Zero Bug Zone',
        OWNER: 'Dineth Sudarshana',
        GITHUB: 'https://github.com/zerobugzone',
        YEAR: new Date().getFullYear()
    }
};
