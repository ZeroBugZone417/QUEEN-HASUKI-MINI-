/**
 * TagAll Command Plugin (QUEEN HASUKI)
 * Tags all group members
 * Copyright © 2025 Zero Bug Zone
 */

module.exports = async (socket, msg, bot) => {
    try {
        const chatId = msg.key.remoteJid;

        // Check if the chat is a group
        if (!chatId.endsWith('@g.us')) {
            return await socket.sendMessage(chatId, {
                text: '❌ This command can only be used in groups.'
            }, { quoted: msg });
        }

        // Get group metadata
        const metadata = await socket.groupMetadata(chatId);
        const participants = metadata.participants.map(p => p.id);

        // Build mention string
        const mentions = participants.map(id => '@' + id.split('@')[0]);
        const text = `
👥 *Attention Everyone!* 👥
${mentions.join(' ')}
        
━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*  
━━━━━━━━━━━━━━━━
        `.trim();

        await socket.sendMessage(chatId, {
            text: text,
            mentions: participants
        }, { quoted: msg });

        // Update statistics
        const stats = bot.statistics || {};
        stats.messagesSent = (stats.messagesSent || 0) + 1;
        await bot.update({ statistics: stats });

    } catch (error) {
        console.error('TagAll command error:', error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: '❌ Error executing tagall command'
        }, { quoted: msg });
    }
};
