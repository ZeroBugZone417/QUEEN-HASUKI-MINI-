/**
 * Alive Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const aliveMessage = `
╔════════════════════╗
      👑 *QUEEN HASUKI* 👑
╚════════════════════╝

📡 *Status:* ✅ Online & Active  
⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s  

🤖 *Bot Name:* ${bot.botName}  
📞 *Phone:* ${bot.phoneNumber}  
⚡ *Version:* ${bot.BOT_VERSION || '2.0.0'}  

━━━━━━━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*  
━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        // Image URL from your GitHub repository
        const imageUrl = 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-MINI-/blob/main/database/QUEEN%20HASUKI.png?raw=true';

        await socket.sendMessage(msg.key.remoteJid, {
            image: { url: imageUrl },
            caption: aliveMessage
        }, { quoted: msg });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Alive command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing alive command'
        }, { quoted: msg });
    }
};
