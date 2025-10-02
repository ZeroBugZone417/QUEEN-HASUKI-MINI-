/**
 * Song Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

const ytdl = require("ytdl-core");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

module.exports = async (socket, msg, bot) => {
    try {
        const text = msg.body?.split(" ").slice(1).join(" ");
        if (!text) {
            return await socket.sendMessage(msg.key.remoteJid, {
                text: "🎶 *Please provide a song name or YouTube link!*\n\n_Example:_ `.song despacito`"
            }, { quoted: msg });
        }

        // Inform searching
        await socket.sendMessage(msg.key.remoteJid, {
            text: `🔍 Searching for *${text}*...`
        }, { quoted: msg });

        let videoUrl = text;
        if (!ytdl.validateURL(text)) {
            // Search from YouTube API (3rd party scrap API)
            const api = `https://api.dytoshub.site/ytsearch?query=${encodeURIComponent(text)}`;
            const res = await axios.get(api);
            if (!res.data || !res.data.result || !res.data.result[0]) {
                return await socket.sendMessage(msg.key.remoteJid, {
                    text: "❌ No results found!"
                }, { quoted: msg });
            }
            videoUrl = res.data.result[0].url;
        }

        const info = await ytdl.getInfo(videoUrl);
        const title = info.videoDetails.title;

        // File path
        const filePath = path.join(__dirname, `${Date.now()}.mp3`);

        // Download song
        const stream = ytdl(videoUrl, { filter: "audioonly", quality: "highestaudio" })
            .pipe(fs.createWriteStream(filePath));

        stream.on("finish", async () => {
            await socket.sendMessage(msg.key.remoteJid, {
                audio: { url: filePath },
                mimetype: "audio/mp4",
                ptt: false,
                caption: `🎶 *${title}* \n✅ Downloaded by QUEEN HASUKI`
            }, { quoted: msg });

            fs.unlinkSync(filePath); // remove temp file
        });

    } catch (error) {
        console.error("Song command error:", error);
        await socket.sendMessage(msg.key.remoteJid, {
            text: "❌ Error fetching song"
        }, { quoted: msg });
    }
};
