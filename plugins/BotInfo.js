/**
 * BotInfo Command Plugin (QUEEN HASUKI)
 * © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, { reply, bot }) => {
    try {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);

        const botInfo = `
╔════════════════════╗
      🤖 *QUEEN HASUKI* 🤖
╠════════════════════╣
⚡ Bot Info

🤖 Name     : ${bot.botName || 'QUEEN HASUKI'}
📌 Version  : ${bot.BOT_VERSION || '2.0.0'}
⏱️ Uptime   : ${hours}h ${minutes}m ${seconds}s
👑 Owner    : Dineth Sudarshana
✨ Powered by *Zero Bug Zone*
╚════════════════════╝
        `.trim();

        await reply(botInfo);
    } catch (error) {
        console.error('BotInfo command error:', error);
        await reply('❌ Error fetching bot info');
    }
};
