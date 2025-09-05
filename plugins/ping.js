/**
 * Ping Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const start = Date.now();
        
        // Send initial ping message
        const pingMsg = await socket.sendMessage(msg.key.remoteJid, {
            text: '🏓 Pinging QUEEN HASUKI...'
        }, { quoted: msg });

        const end = Date.now();
        const latency = end - start;

        const pongMessage = `
╔════════════════════╗
       🏓 *PONG!*  
╚════════════════════╝

⚡ *Latency:* ${latency}ms  
🤖 *Bot:* ${bot.botName}  
📱 *Status:* ✅ Online & Active  

━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*
━━━━━━━━━━━━━━━━
        `.trim();

        await socket.sendMessage(msg.key.remoteJid, {
            text: pongMessage,
            edit: pingMsg.key
        });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Ping command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing ping command'
        }, { quoted: msg });
    }
};
