/**
 * Song Command
 * Download song by name
 */

const ytdl = require('ytdl-core'); // youtube download library

module.exports = {
    pattern: 'song',
    category: 'Media',
    desc: 'Download song',
    alias: [],
    run: async (socket, msg, bot, { args }) => {
        if (!args[0]) return socket.sendMessage(msg.key.remoteJid, { text: 'Please provide song name' }, { quoted: msg });

        const search = args.join(' ');
        // Example: call some API to get song URL
        const songUrl = `https://youtube.com/watch?v=dQw4w9WgXcQ`; // placeholder

        await socket.sendMessage(msg.key.remoteJid, { text: `Downloading: ${search}\nURL: ${songUrl}` }, { quoted: msg });
    }
};
