/**
 * Owner Info Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

const { cmd } = require("../database/command");

cmd({
    pattern: "owner",
    desc: "Show Owner Information",
    category: "general",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, bot }) => {
    try {
        // Owner Information Text
        const ownerText = `
👑 *OWNER INFO*

🤖 Bot: ${bot.botName || "QUEEN-HASUKI"}  
👤 Owner: Dineth Sudarshana  
📧 Email: your.email@example.com  
📱 Status: ✅ Online & Active
        `.trim();

        // Define buttons
        const buttons = [
            { buttonId: 'contact_owner', buttonText: { displayText: '📞 Contact Owner' }, type: 1 }
        ];

        // Button message
        const buttonMessage = {
            text: ownerText,
            footer: '✨ Powered by Zero Bug Zone',
            buttons: buttons,
            headerType: 1
        };

        // Send button response
        await conn.sendMessage(from, buttonMessage, { quoted: mek });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Owner command error:', error);
        await conn.sendMessage(from, {
            text: '❌ Error executing owner command'
        }, { quoted: mek });
    }
});
