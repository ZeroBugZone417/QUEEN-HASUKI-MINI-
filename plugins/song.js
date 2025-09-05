const { cmd } = require("../command");
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

cmd(
  {
    pattern: "song",
    desc: "🎵 Download free songs (Jamendo API)",
    category: "media",
    filename: __filename,
  },
  async (bot, mek, m, { q, reply }) => {
    try {
      if (!q) return reply("⚠️ *Usage:* .song <name>");

      let res = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=YOUR_JAMENDO_CLIENT_ID&format=json&limit=1&namesearch=${encodeURIComponent(q)}`
      );
      let data = await res.json();
      if (!data.results.length) return reply("❌ *No song found!*");

      let song = data.results[0];
      await reply(`🎶 *Song Found!*\n📌 Title: *${song.name}*\n👤 Artist: *${song.artist_name}*\n\n⬇️ *Sending audio...*`);

      await bot.sendMessage(m.chat, {
        audio: { url: song.audio },
        mimetype: "audio/mp3",
        ptt: false,
      }, { quoted: mek });
    } catch (e) {
      console.error(e);
      reply("❌ *Error while downloading song!*");
    }
  }
);
