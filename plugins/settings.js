/**
 * Settings Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const prefix = bot.settings.prefix || '.';

        const settingsMessage = `
╔════════════════════╗
     ⚙️ *QUEEN HASUKI SETTINGS*  
╚════════════════════╝

🤖 *Bot Info*
├ Name: ${bot.botName}
├ Version: ${bot.BOT_VERSION || '2.0.0'}
├ Prefix: ${prefix}
└ Status: ✅ Online & Active

📌 *Current Settings*
├ Auto View Status: ${bot.settings.AUTO_VIEW_STATUS ? '✅ Enabled' : '❌ Disabled'}
├ Auto Like Status: ${bot.settings.AUTO_LIKE_STATUS ? '✅ Enabled' : '❌ Disabled'}
├ Auto Recording: ${bot.settings.AUTO_RECORDING ? '✅ Enabled' : '❌ Disabled'}
├ Max Retries: ${bot.settings.MAX_RETRIES || 3}
├ Rate Limit Window: ${bot.settings.RATE_LIMIT_WINDOW / 60000} minutes
├ Rate Limit Max: ${bot.settings.RATE_LIMIT_MAX || 100} requests

💡 *Admin Commands for Settings*
├ ${prefix}setprefix <symbol> - Change bot prefix
├ ${prefix}toggle <feature> - Enable/disable feature (autoView, autoLike, autoRecord)
├ ${prefix}setmaxretries <number> - Change max retries
└ ${prefix}setratelimit <max> - Change rate limit

━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*  
🌐 GitHub: github.com/ZeroBugZone
━━━━━━━━━━━━━━━━
        `.trim();

        await socket.sendMessage(msg.key.remoteJid, {
            text: settingsMessage
        }, { quoted: msg });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Settings command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing settings command'
        }, { quoted: msg });
    }
};
