// ================================
// *DON'T REMOVE CREDIT*
// *🧑‍🔧 `Credit by:` Mr.Tharuzz ofc*
//================================


const fetch = require('node-fetch')
const config = {
  THARUZZ_FOOTER: "> ©POWERD BY THARUZZ | OFC",
  THARUZZ_IMAGE_URL: "Enter your image url..."
}


// TIK TOK COMMAND
case 'ttdl': {
  const link = args.join(" ");
  
  try {
    if (!link) {
      await socket.sendMessage(from, {text: "Please enter valid tik tok video link !!"});
    }
    
    const ttTharuzzApi = await fetch(`https://tharuzz-ofc-apis.vercel.app/api/download/ttdl?url=${link}`);
    const ttResponseTharuzz = await ttTharuzzApi.json();
    
    if (!ttResponseTharuzz?.result) {
      await socket.sendMessage(from, {text: "No result found :("})
    }
    
    const {title, duration, play_count, digg_count} = ttResponseTharuzz.result;
    
    const ttCap = `*📥 \`THARUSHA-MD MINI TIK TOK DOWNLOADER\`*\n\n` +
      `*┏━━━━━━━━━━━━━━━*\n` +
      `*┃ 📌 \`ᴛɪᴛʟᴇ:\`* ${title || "N/A"}\n` +
      `*┃ ⏰ \`ᴅᴜʀᴀᴛɪᴏɴ:\` ${duration || "N/A"}*\n` +
      `*┃ 👀 \`ᴠɪᴇᴡꜱ:\` ${play_count || "N/A"}*\n` +
      `*┃ 🤍 \`ʟɪᴋᴇꜱ:\` ${digg_count || "N/A"}*\n` +
      `*┃ 📎 \`ᴜʀʟ:\` ~${link}~*\n` +
      `*┗━━━━━━━━━━━━━━━━━━*\n` +
      `*\`𝚂𝙴𝙻𝙴𝙲𝚃 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳 𝚃𝚈𝙿𝙴 ⬇️\`*\n\n` + config.THARUZZ_FOOTER;

      const buttonPanel = [{
      buttonId: "action",
      buttonText: { displayText: "🔢 ꜱᴇʟᴇᴄᴛ ᴠɪᴅᴇᴏ ᴛʏᴘᴇ" },
      type: 4,
      nativeFlowInfo: {
        name: "single_select",
        paramsJson: JSON.stringify({
          title: "🔢 ꜱᴇʟᴇᴄᴛ ᴠɪᴅᴇᴏ ᴛʏᴘᴇ",
          sections: [{
            title: "TIK TOK DOWNLOADER 📥",
            highlight_label: "",
            rows: [
              {
                title: "🎟️ ᴡɪᴛʜᴏᴜᴛ ᴡᴀᴛᴇʀᴍᴀʀᴋ",
                description: "Download video without watermark.",
                id: `${config.PREFIX}ttdltharuzz NO_WM ${link}`
              },
              {
                title: "🎫 ᴡɪᴛʜ ᴡᴀᴛᴇʀᴍᴀʀᴋ",
                description: "Download video with watermark.",
                id: `${config.PREFIX}ttdltharuzz WM ${link}`
              },
              {
                title: "🎶 ᴀᴜᴅɪᴏ ꜰɪʟᴇ",
                description: "Download video audio.",
                id: `${config.PREFIX}ttdltharuzz AUDIO ${link}`
              }
            ]
          }]
        })
      }
    }];
    
    await socket.sendMessage(from, {
      image: { url: ttResponseTharuzz.result.cover || config.THARUZZ_IMAGE_URL },
      caption: ttCap,
      buttons: buttonPanel,
      headerType: 1,
      viewOnce: true
    }, { quoted: msg });
      
    
  } catch (e) {
    console.log(e);
    await socket.sendMessage(from, {text: "❌ Error: " + e});
  }
  break;
};

case 'ttdltharuzz': {
  await socket.sendMessage(sender, { react: { text: '📥', key: msg.key } });

  const q = args.join(" ");
  const mediaType = q.split(" ")[0];
  const mediaLink = q.split(" ")[1];
  try {
    const ttApi = await fetch(`https://tharuzz-ofc-apis.vercel.app/api/download/ttdl?url=${mediaLink}`);
    const response = await ttApi.json();
    if (!response.result.hd || !response.result.sd) {
      await socket.sendMessage(from, { text: "No download link found !!" }, { quoted: msg });
    }
    
    if ( mediaType === "NO_WM" ) {
      await socket.sendMessage(from, {
        video: {url: response.result.hd},
        caption: `*📌 \`Title:\`* ${response.result.title}\n\n${config.THARUZZ_FOOTER}`
      }, {quoted:msg})
    };
    
    if ( mediaType === "WM" ) {
      await socket.sendMessage(from, {
        video: {url: response.result.sd},
        caption: `*📌 \`Title:\`* ${response.result.title}\n\n${config.THARUZZ_FOOTER}`
      }, {quoted:msg})
    }
    
    if ( mediaType === "AUDIO" ) {
      await socket.sendMessage(from, {
        audio: {url: response.result.music},
        mimetype: "audio/mpeg"
      }, {quoted:msg})
    }
    
    
  } catch (e) {
    console.log(e);
    await socket.sendMessage(from, { text: "An error occurred while processing the TikTok video." }, { quoted: msg });
  }
  break;
};


// *📲 `FOLLOW US:`* ~https://whatsapp.com/channel/0029Vb9LTRHInlqISdCfln45~

// *📲 `FOLLOW US:`* ~https://whatsapp.com/channel/0029Vb9LTRHInlqISdCfln45~
