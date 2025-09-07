/**
 * Help Command Plugin
 * © 2025 Zero Bug Zone
 */


module.exports = async (socket, msg, bot) => {
    try {
        const helpMessage = `
╭───📖 HELP MENU ───╮
│ 🤖 ${bot.botName}
│
│ ⚡ *Alive*  → .alive
│ 🏓 *Ping*   → .ping
│ 📖 *Help*   → .help
│ 👑 *Owner*  → .owner
│ ⏰ *Time*   → .time
│ 👥 *Group*  → .groupinfo
╰───────────────────╯

*© 2025 DarkSide Developers*
        `.trim();

        await socket.sendMessage(msg.key.remoteJid, {
            text: helpMessage
        }, { quoted: msg });

    } catch (error) {
        console.error('Help command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing help command'
        }, { quoted: msg });
    }
};
