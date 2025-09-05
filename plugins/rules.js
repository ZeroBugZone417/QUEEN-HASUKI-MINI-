/**
 * Interactive Rules Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const imageUrl = 'https://github.com/ZeroBugZone417/QUEEN-HASUKI-MINI-/blob/main/database/QUEEN%20HASUKI.png?raw=true';

        const rulesMessage = `
╔════════════════════╗
        📜 *RULES*  
╚════════════════════╝

1️⃣ Be respectful to everyone.  
2️⃣ No spamming or flooding the chat.  
3️⃣ Avoid sharing illegal or harmful content.  
4️⃣ Do not share others’ personal information.  
5️⃣ Use commands responsibly.  

━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*
━━━━━━━━━━━━━━━━
        `.trim();

        // Define buttons
        const buttons = [
            { buttonId: 'accept_rules', buttonText: { displayText: '✅ Accept' }, type: 1 },
            { buttonId: 'more_info', buttonText: { displayText: 'ℹ️ More Info' }, type: 1 }
        ];

        const buttonMessage = {
            image: { url: imageUrl },
            caption: rulesMessage,
            footer: 'Click a button to proceed',
            buttons: buttons,
            headerType: 4
        };

        await socket.sendMessage(msg.key.remoteJid, buttonMessage, { quoted: msg });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Interactive Rules command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error fetching rules'
        }, { quoted: msg });
    }
};
