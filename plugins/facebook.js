const { cmd } = require("../command");
const FbVideo = require("../database/models/fbVideoModel");

cmd({
    pattern: "fb",
    alias: ["fbdl", "facebook"],
    desc: "Download Facebook public video",
    category: "downloader",
    use: ".fb <Facebook video URL>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply, sender }) => {
    if (!q) return reply("❌ Please provide a Facebook video URL.");

    reply("⏳ Fetching video...");

    // Example: store in DB (replace with actual video fetch)
    await FbVideo.create({
        title: "Sample FB Video",
        url: q,
        duration: "00:02:34",
        requestedBy: sender
    });

    reply(`✅ Video saved: ${q}`);
});
