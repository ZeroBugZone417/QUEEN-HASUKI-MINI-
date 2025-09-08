/**
 * Owner Command Plugin (QUEEN HASUKI)
 * © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, { reply }) => {
    try {
        const ownerInfo = `
╔════════════════════╗
      👑 *QUEEN HASUKI* 👑
╠════════════════════╣
📌 *Owner Info*

👤 Name  : Dineth Sudarshana
📞 Phone : +94789737967
🌐 GitHub: https://github.com/ZeroBugZone417
✨ Powered by *Zero Bug Zone*
╚════════════════════╝
        `.trim();

        await reply(ownerInfo);
    } catch (error) {
        console.error('Owner command error:', error);
        await reply('❌ Error fetching owner info');
    }
};
