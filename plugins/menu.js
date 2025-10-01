/**
 * Menu Plugin (QUEEN HASUKI MINI) - Interactive Template Version
 * Works on Baileys v6+
 */

const { generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

module.exports = async (socket, msg, bot) => {
    try {
        const prefix = (bot.settings && bot.settings.prefix) ? bot.settings.prefix : '.';

        const menuText = `👑 *QUEEN HASUKI MINI* 👑
Advanced Bot System

🤖 BOT INFO
• Name: ${bot.botName || 'Unknown'}
• Version: 2.0.0
• Prefix: ${prefix}
• Status: Active`;

        const buttons = [
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Alive', id: `${prefix}alive` }) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Help', id: `${prefix}help` }) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Ping', id: `${prefix}ping` }) },
            { name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Settings', id: `${prefix}settings` }) },
        ];

        const msgContent = generateWAMessageFromContent(msg.key.remoteJid, {
            viewOnceMessage: {
                message: {
                    interactiveMessage: proto.Message.InteractiveMessage.create({
                        body: proto.Message.InteractiveMessage.Body.create({
                            text: menuText
