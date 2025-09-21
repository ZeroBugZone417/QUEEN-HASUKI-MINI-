/**
 * Owner Info Command Plugin with Button (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const ownerText = `
👑 *OWNER INFO*

🤖 Bot: ${bot.botName}  
👤 Owner: Dineth Sudarshana  
📧 Email: your.email@example.com  
📱 Status: ✅ Online & Active
        `.trim();

        // Define button
        const buttons = [
            { buttonId: 'contact_owner', buttonText: { displayText: '📞 Contact Owner' }, type: 1 }
        ];

        const buttonMessage = {
            text: ownerText,
            buttons: buttons,
            headerType: 1,
            footerText: '✨ Powered by Zero Bug Zone'
        };

        await socket.sendMessage(msg.key.remoteJid, buttonMessage, { quoted: msg });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Owner command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing owner command'
        }, { quoted: msg });
    }
};
