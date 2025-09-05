/**
 * YouTube Video & Song Downloader (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

const fetch = require('node-fetch');
const ytsearch = require('yt-search'); // make sure yt-search is installed

// ===== MP4 Video Download =====
cmd({ 
    pattern: "mp4", 
    alias: ["video"], 
    react: "🎥", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.mp4 <YouTube URL or Name>', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return reply("❌ Please provide a YouTube URL or video name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("❌ No results found!");
        
        let video = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("❌ Failed to fetch the video. Please try again later.");
        }

        let msgCaption = `
📹 *QUEEN HASUKI VIDEO DOWNLOAD*
🎬 *Title:* ${video.title}
⏳ *Duration:* ${video.timestamp}
👀 *Views:* ${video.views}
👤 *Author:* ${video.author.name}
🔗 *Link:* ${video.url}

━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*
━━━━━━━━━━━━━━━━
        `.trim();

        await conn.sendMessage(from, { 
            video: { url: data.result.download_url }, 
            caption: msgCaption,
            mimetype: "video/mp4"
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ An error occurred. Please try again later.");
    }
});

// ===== MP3 Song Download =====
cmd({ 
    pattern: "song", 
    alias: ["play", "mp3"], 
    react: "🎶", 
    desc: "Download YouTube song", 
    category: "main", 
    use: '.song <query>', 
    filename: __filename 
}, async (conn, mek, m, { from, reply, q }) => { 
    try {
        if (!q) return reply("❌ Please provide a song name or YouTube link.");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("❌ No results found!");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("❌ Download failed. Try again later.");

        const caption = `
🎵 *QUEEN HASUKI SONG DOWNLOAD*
🎶 *Title:* ${song.title}
⏳ *Duration:* ${song.timestamp}
👤 *Author:* ${song.author.name}
🔗 *Link:* ${song.url}

━━━━━━━━━━━━━━━━
✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*
━━━━━━━━━━━━━━━━
        `.trim();

        await conn.sendMessage(from, {
            audio: {
