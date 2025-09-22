/**
 * Alive Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        // Bot uptime calculation
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        // Alive message format
        const aliveMessage = `
╔════════════════════╗
      👑 *QUEEN HASUKI* 👑
╚════════════════════╝

📡 *Status:* ✅ Online & Active  
⏱️ *Uptime:* ${hours}h ${minutes}m ${seconds}s  

🤖 *Bot Name:* ${bot.botName || "QUEEN-HASUKI"}  
📞 *Phone:* ${bot.phoneNumber || "Unknown"}  
⚡ *Version:* ${bot.BOT_VERSION || '2.0.0'}  

━━━━━━━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*  
━━━━━━━━━━━━━━━━━━━━━━
        `.trim();

        // Bot logo / Alive image
        const imageUrl = 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-MINI-/blob/main/database/QUEEN%20HASUKI.png?raw=true';

        // Send alive response
        await socket.sendMessage(msg.key.remoteJid, {
            image: { url: imageUrl },
            caption: alive
        }, { quoted: msg });

        // Update bot statistics
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
