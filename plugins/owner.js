/**
 * Owner Info Command Plugin with Button
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const from = msg.key.remoteJid;
        const body =
            msg.message.conversation ||
            msg.message.extendedTextMessage?.text ||
            '';

        // Trigger: .owner
        if (!body.toLowerCase().startsWith('.owner')) return;

        const ownerText = `
👑 *OWNER INFO*

🤖 Bot: ${bot.name || 'QUEEN-HASUKI'}  
👤 Owner: Dineth Sudarshana  
📧 Email: your.email@example.com  
📱 Status: ✅ Online & Active
        `.trim();

        // Define button
        const buttons = [
            {
                buttonId: 'contact_owner',
                buttonText: { displayText: '📞 Contact Owner' },
                type: 1
            }
        ];

        const buttonMessage = {
            text: ownerText,
            buttons: buttons,
            headerType: 1,
            footerText: '✨ Powered by Zero Bug Zone'
        };

        await socket.sendMessage(from, buttonMessage, { quoted: msg });

        // Update bot statistics
        const stats = bot.statistics || {};
        stats.commandsExecuted = (stats.commandsExecuted || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('Owner plugin error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing owner command'
        }, { quoted: msg });
    }
};
