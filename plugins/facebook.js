const { cmd } = require("../command");
const fdown = require("../utils/fdown");
const FacebookVideo = require("../database/models/fbModel");

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "Download Facebook videos",
    category: "downloader",
    use: ".fb <facebook url>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    try {
        if (!q) return reply("❌ Please provide a Facebook video URL.");

        const video = await fdown.download(q);
        if (!video || (!video.normalQualityLink && !video.hdQualityLink)) {
            return reply("⚠️ Could not fetch download links.");
        }

        // Save to DB
        await FacebookVideo.create({
            title: video.title,
            description: video.description,
            thumbnail: video.thumbnail,
            duration: video.duration,
            normalQualityLink: video.normalQualityLink,
            hdQualityLink: video.hdQualityLink,
            requestedBy: sender
        });

        const videoUrl = video.hdQualityLink || video.normalQualityLink;
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: `🎬 *${video.title}*\n🕒 Duration: ${video.duration || "N/A"}`
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ FB Plugin Error:", err);
        reply("⚠️ Something went wrong while processing your request.");
    }
});

