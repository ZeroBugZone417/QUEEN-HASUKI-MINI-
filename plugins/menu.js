/**
 * Menu Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

const { cmd, commands } = require("../command");

cmd(
  {
    pattern: "menu",
    desc: "📖 Display all command categories",
    category: "main",
    filename: __filename,
  },
  async (bot, mek, m, { from, reply }) => {
    try {
      const categories = {};

      // Group commands by category
      for (let cmdName in commands) {
        const cmdData = commands[cmdName];
        const cat = cmdData.category?.toLowerCase() || "other";
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push({
          pattern: cmdData.pattern,
          desc: cmdData.desc || "No description",
        });
      }

      // Build menu text
      let menuText = `
╔════════════════════╗
   👑 *HASUKI BOT MENU* 👑
╚════════════════════╝

`.trim() + "\n\n";

      for (let cat in categories) {
        menuText += `*📂 ${cat.toUpperCase()}*\n`;
        categories[cat].forEach((c) => {
          menuText += `➤ *${c.pattern}* — _${c.desc}_\n`;
        });
        menuText += "\n"; // spacing
      }

      // Footer with owner + GitHub
      menuText += `
━━━━━━━━━━━━━━━━━━━━━━
👤 *Owner:* wa.me/94769983151  
🌐 *GitHub:* https://github.com/ZeroBugZone  
🛡 *Powered by Zero Bug Zone*
━━━━━━━━━━━━━━━━━━━━━━
`.trim();

      // Send menu
      await bot.sendMessage(from, { text: menuText }, { quoted: mek });

    } catch (err) {
      console.error("Menu Error:", err);
      reply("❌ Error generating menu.");
    }
  }
);
