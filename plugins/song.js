/**
 * Song Command
 * Download song by name
 */

const { cmd } = require("../command");
const yts = require("yt-search");
const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const Song = require("../database/models/songModel");

cmd({
    pattern: "song",
    alias: ["music", "audio"],
    desc: "Download song from YouTube",
    category: "downloader",
    use: ".song <song name or YouTube URL>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Please provide a song name or YouTube URL.");

        let songUrl = q;
        let title = "";
        let duration = "";

        // If input is not URL, search YouTube
        if (!/^https?:\/\//.test(q)) {
            const searchResult = await yts(q);
            if (!searchResult || !searchResult.videos.length) return reply("⚠️ Song not found on YouTube.");
            const video = searchResult.videos[0];
            songUrl = video.url;
            title = video.title;
            duration = video.timestamp;
        } else {
            const info = await ytdl.getInfo(q);
            title = info.videoDetails.title;
            duration = new Date(parseInt(info.videoDetails.lengthSeconds) * 1000).toISOString().substr(11, 8);
        }

        reply(`🎵 Downloading: *${title}* ...`);

        // Temp file path
        const tempFile = path.join(__dirname, "../uploads", `${Date.now()}.mp3`);

        // Download audio
        const stream = ytdl(songUrl, { filter: "audioonly", quality: "highestaudio" });
        const writeStream = fs.createWriteStream(tempFile);
        stream.pipe(writeStream);

        writeStream.on("finish", async () => {
            // Save to DB
            await Song.create({
                title,
                url: songUrl,
                duration,
                requestedBy: sender
            });

            await conn.sendMessage(from, { audio: fs.readFileSync(tempFile), mimetype: "audio/mpeg", fileName: `${title}.mp3` }, { quoted: mek });
            fs.unlinkSync(tempFile); // Delete temp file
        });

        writeStream.on("error", (err) => {
            console.error(err);
            reply("⚠️ Error downloading song.");
        });

    } catch (err) {
        console.error("❌ Song Plugin Error:", err);
        reply("⚠️ Something went wrong while downloading the song.");
    }
});
