/**
 * QUEEN-HASUKI Configuration
 * Copyright © 2025 Zero Bug Zone
 * Owner: Dineth Sudarshana
 * GitHub: https://github.com/ZeroBugZone417
 */

module.exports = {
    // Application Settings
    APP_NAME: 'QUEEN-HASUKI',
    APP_VERSION: '2.0.0',
    APP_DESCRIPTION: 'Advanced WhatsApp Bot Management System',
    
    // Server Configuration
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    
    // Database Configuration
    DATABASE_URL: "local", // Change to PostgreSQL URL for cloud database
    
    // JWT Configuration
    JWT_SECRET: 'queen-mini-jwt-secret-key-2025-darkside-developers',
    JWT_EXPIRES_IN: '7d',
    
    // Email Configuration (Nodemailer)
    EMAIL_HOST: 'smtp.gmail.com',
    EMAIL_PORT: 587,
    EMAIL_USER: 'your-email@gmail.com',
    EMAIL_PASS: 'your-app-password',
    EMAIL_FROM: 'QUEEN-HASUKI <noreply@queen-hasuki.com>',
    
    // WhatsApp Bot Configuration
    BOT_NAME: 'QUEEN-HASUKI',
    BOT_VERSION: '2.0.0',
    BOT_FOOTER: '© 2025 Zero Bug Zone',
    PREFIX: '.',
    
    // Admin Configuration
    ADMIN_EMAIL: 'admin@queen-mini.com',
    ADMIN_PASSWORD: 'admin123', // Change this in production
    
    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX: 100, // requests per window
    
    // File Upload
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    UPLOAD_PATH: './uploads',
    
    // Bot Settings
    AUTO_VIEW_STATUS: true,
    AUTO_LIKE_STATUS: true,
    AUTO_RECORDING: true,
    AUTO_LIKE_EMOJI: ['🧩', '🍉', '💜', '🌸', '🪴', '💊', '💫', '🍂', '🌟', '🎋'],
    MAX_RETRIES: 3,
    
    // GitHub Integration (Optional)
    GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
    GITHUB_REPO_OWNER: 'ZeroBugZone417',
    GITHUB_REPO_NAME: 'QUEEN-HASUKI',
    
    // Copyright Information
    COPYRIGHT: {
        COMPANY: 'Zero Bug Zone',
        OWNER: 'Dineth Sudarshana',
        GITHUB: 'https://github.com/ZeroBugZone417',
        YEAR: new Date().getFullYear()
    }
};
