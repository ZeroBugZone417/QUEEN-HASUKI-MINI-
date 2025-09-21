/**
 * Menu Plugin (QUEEN HASUKI MINI) - Button Version
 * Copyright © 2025 Zero Bug Zone
 * Owner: Dineth Sudarshana
 * GitHub: github.com/zerobugzone417
 */

module.exports = async (socket, msg, bot) => {
    try {
        const prefix = bot.settings.prefix || '.';
        
        const menuMessage = `👑 *QUEEN HASUKI MINI* 👑
Advanced Bot System

🤖 BOT INFO
• Name: ${bot.botName}
• Version: 2.0.0
• Prefix: ${prefix}
• Status: Active

📋 MAIN COMMANDS
• ${prefix}alive
• ${prefix}ping
• ${prefix}help
• ${prefix}settings

🎵 MEDIA COMMANDS
• ${prefix}song <name>
• ${prefix}video <name>
• ${prefix}ytmp3 <url>
• ${prefix}ytmp4 <url>

🛠️ UTILITY COMMANDS
• ${prefix}sticker
• ${prefix}weather <city>
• ${prefix}translate <text>
• ${prefix}qr <text>

👥 GROUP COMMANDS
• ${prefix}tagall
• ${prefix}promote
• ${prefix}demote
• ${prefix}kick

🎮 FUN COMMANDS
• ${prefix}joke
• ${prefix}quote
• ${prefix}meme
• ${prefix}fact`;

        // Define buttons
        const buttons = [
            { buttonId: `${prefix}alive`, buttonText: { displayText: 'Alive' }, type: 1 },
            { buttonId: `${prefix}help`, buttonText: { displayText: 'Help' }, type: 1 },
            { buttonId: `${prefix}ping`, buttonText: { displayText: 'Ping' }, type: 1 },
            { buttonId: `${prefix}settings`, buttonText: { displayText: 'Settings' }, type: 1 },
        ];

        const buttonMessage = {
            text: menuMessage,
            footer: '👑 QUEEN HASUKI MINI | © 2025 Zero Bug Zone',
            buttons: buttons,
            headerType: 1
        };

        await socket.sendMessage(msg.key.remoteJid, buttonMessage, { quoted: msg });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Menu button command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing menu button command'
        }, { quoted: msg });
    }
};
