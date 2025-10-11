
// =========================================
// 🎵 SONG DOWNLOADER WITH BUTTONS
// POWERED BY HASUKI OFC
// =========================================

const fetch = require('node-fetch');
const config = {
  PREFIX: ".",
  THARUZZ_FOOTER: "> ©POWERD BY HASUKI | OFC",
  THARUZZ_IMAGE_URL: "https://i.ibb.co/F4g6y6L/default-thumbnail.jpg"
};

// MAIN SONG COMMAND
case 'song': {
  const text = args.join(" ");
  if (!text) {
    await socket.sendMessage(from, { text: "🔍 Please enter a song name or YouTube link!" });
    return;
  }

  try {
    await socket.sendMessage(sender, { react: { text: '🎶', key: msg.key } });

    const res = await fetch(`https://api-aswin-sparky.vercel.app/api/download/ytmp3?query=${encodeURIComponent(text)}`);
    const data = await res.json();

    if (!data || !data.result) {
      await socket.sendMessage(from, { text: "❌ No results found for that song." }, { quoted: msg });
      return;
    }

    const { title, channel, duration, views, thumbnail, video_url } = data.result;

    const songCap = `*🎧 𝗛𝗔𝗦𝗨𝗞𝗜 𝗠𝗗 𝗦𝗢𝗡𝗚 𝗗𝗢𝗪𝗡𝗟𝗢𝗔𝗗𝗘𝗥*\n\n` +
      `*🎵 Title:* ${title || "N/A"}\n` +
      `*🎤 Channel:* ${channel || "N/A"}\n` +
      `*⏰ Duration:* ${duration || "N/A"}\n` +
      `*👁️ Views:* ${views || "N/A"}\n\n` +
      `*\`Select download type below ⬇️\`*\n\n${config.THARUZZ_FOOTER}`;

    const buttonPanel = [
      {
        buttonId: "action",
        buttonText: { displayText: "🎚️ SELECT DOWNLOAD TYPE" },
        type: 4,
        nativeFlowInfo: {
          name: "single_select",
          paramsJson: JSON.stringify({
            title: "🎧 SELECT DOWNLOAD TYPE",
            sections: [
              {
                title: "YOUTUBE SONG DOWNLOADER 🎵",
                rows: [
                  {
                    title: "🎶 Audio (MP3)",
                    description: "Download only audio",
                    id: `${config.PREFIX}songhasuki AUDIO ${video_url}`
                  },
                  {
                    title: "🎬 Video (MP4)",
                    description: "Download full video",
                    id: `${config.PREFIX}songhasuki VIDEO ${video_url}`
                  }
                ]
              }
            ]
          })
        }
      }
    ];

    await socket.sendMessage(from, {
      image: { url: thumbnail || config.THARUZZ_IMAGE_URL },
      caption: songCap,
      buttons: buttonPanel,
      headerType: 1,
      viewOnce: true
    }, { quoted: msg });

  } catch (err) {
    console.error(err);
    await socket.sendMessage(from, { text: "⚠️ Error while fetching song info." }, { quoted: msg });
  }
  break;
}

// SUB COMMAND (DOWNLOAD HANDLER)
case 'songhasuki': {
  await socket.sendMessage(sender, { react: { text: '📥', key: msg.key } });

  const q = args.join(" ");
  const mediaType = q.split(" ")[0];
  const ytLink = q.split(" ")[1];

  try {
    if (mediaType === "AUDIO") {
      const res = await fetch(`https://api-aswin-sparky.vercel.app/api/download/ytmp3?query=${encodeURIComponent(ytLink)}`);
      const data = await res.json();

      await socket.sendMessage(from, {
        audio: { url: data.result.download_url },
        mimetype: "audio/mpeg",
        fileName: `${data.result.title || "song"}.mp3`
      }, { quoted: msg });
    }

    if (mediaType === "VIDEO") {
      const res = await fetch(`https://api-aswin-sparky.vercel.app/api/download/ytmp4?url=${encodeURIComponent(ytLink)}`);
      const data = await res.json();

      await socket.sendMessage(from, {
        video: { url: data.result.download_url },
        caption: `*🎥 Title:* ${data.result.title}\n\n${config.THARUZZ_FOOTER}`
      }, { quoted: msg });
    }

  } catch (err) {
    console.error(err);
    await socket.sendMessage(from, { text: "⚠️ Error while downloading song." }, { quoted: msg });
  }
  break;
}
