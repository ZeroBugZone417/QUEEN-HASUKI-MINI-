const { cmd } = require("../command");
const ytdl = require("ytdl-core");

cmd({
  pattern: "ytmp3",
  desc: "🎶 Download YouTube audio",
  category: "download",
  filename: __filename,
}, async (bot, mek, m, { q, reply }) => {
  try {
    if (!q) return reply("⚠️ *Usage:* .ytmp3 <YouTube URL>");
    if (!ytdl.validateURL(q)) return reply("❌ Invalid YouTube URL!");

    let info = await ytdl.getInfo(q);
    let title = info.videoDetails.title;

    await reply(`🎶 *Downloading:*\n📌 Title: ${title}`);

    bot.sendMessage(m.chat, {
      audio: { url: ytdl(q, { filter: "audioonly" }) },
      mimetype: "audio/mp3"
    }, { quoted: mek });
  } catch (e) {
    console.error(e);
    reply("❌ Error downloading audio!");
  }
});
