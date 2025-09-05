/**
 * Rules Command Plugin (QUEEN HASUKI)
 * Copyright © 2025 Zero Bug Zone
 */

const { cmd } = require("../command");

cmd(
  {
    pattern: "rul",
    desc: "📜 Show bot rules",
    category: "main",
    filename: __filename,
  },
  async (bot, mek, m, { reply }) => {
    try {
      const rulesMessage = `
╔════════════════════╗
   📜 *BOT RULES & TERMS*  
╚════════════════════╝

1️⃣ *Do not spam commands*
   - Spamming can get you blocked ❌

2️⃣ *Respect all users*
   - No abuse, racism, or harassment 🚫

3️⃣ *No illegal content*
   - Bot will reject piracy, scams, or adult stuff ⚠️

4️⃣ *Use responsibly*
   - Heavy usage may cause temporary ban ⏳

5️⃣ *Follow owner instructions*
   - Admin decisions are final 👑

━━━━━━━━━━━━━━━━
✅ If you agree with these rules, enjoy using *QUEEN HASUKI* 💫  
❌ If not, please leave gracefully.

✨ Powered by *Zero Bug Zone*  
👑 Owner: *Dineth Sudarshana*  
━━━━━━━━━━━━━━━━
      `.trim();

      await bot.sendMessage(m.chat, {
        image: { url: "https://github.com/ZeroBugZone417/QUEEN-HASUKI-MINI-/blob/main/database/QUEEN%20HASUKI.png?raw=true" },
        caption: rulesMessage,
      }, { quoted: mek });

    } catch (e) {
      console.error("Rules command error:", e);
      reply("❌ Error while displaying rules!");
    }
  }
);
