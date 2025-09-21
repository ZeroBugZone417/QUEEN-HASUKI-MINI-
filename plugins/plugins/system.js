const { cmd } = require('../command');
const os = require('os');
const moment = require('moment');
const speed = require('performance-now');
const { exec } = require('child_process');
const config = require('../config');

cmd({
    pattern: "sysinfo",
    alias: ["systeminfo", "serverinfo", "status"],
    desc: "Display detailed system information of the bot server with buttons",
    category: "info",
    react: "📊",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const uptime = moment.duration(os.uptime(), 'seconds').humanize();

        // Bot info
        const botInfo = {
            name: config.BOT_NAME || "YourBot",
            version: config.VERSION || "5.0.0",
            creator: "ArslanMD 👑",
            contact: "+923237045919"
        };

        const mainInfo = `
👑 *${botInfo.name}* System Info
🔖 Version: ${botInfo.version}
👑 Creator: ${botInfo.creator} (${botInfo.contact})

💻 Hostname: ${os.hostname()}
🛠️ Platform: ${os.platform()} (${os.arch()})
⏳ Uptime: ${uptime}
        `.trim();

        // Buttons for detailed info
        const buttons = [
            { buttonId: '.sysinfo cpu', buttonText: { displayText: 'CPU Usage' }, type: 1 },
            { buttonId: '.sysinfo ram', buttonText: { displayText: 'RAM Usage' }, type: 1 },
            { buttonId: '.sysinfo disk', buttonText: { displayText: 'Disk Space' }, type: 1 },
            { buttonId: '.sysinfo ip', buttonText: { displayText: 'IP Address' }, type: 1 }
        ];

        await conn.sendMessage(from, {
            text: mainInfo,
            buttons,
            headerType: 1
        }, { quoted: mek });

        // Handle sub-commands
        if (m.args && m.args.length > 0) {
            const sub = m.args[0].toLowerCase();
            switch(sub) {
                case "cpu":
                    const cpu = os.cpus()[0].model;
                    const usage = await getCpuUsage();
                    await reply(`⚡ CPU: ${cpu}\n📊 Usage: ${usage}%`);
                    break;
                case "ram":
                    const totalMem = (os.totalmem() / (1024 ** 3)).toFixed(2);
                    const freeMem = (os.freemem() / (1024 ** 3)).toFixed(2);
                    const usedMem = (totalMem - freeMem).toFixed(2);
                    await reply(`🧠 RAM Usage: ${usedMem}GB / ${totalMem}GB (${Math.round((usedMem / totalMem) * 100)}% used)`);
                    break;
                case "disk":
                    const disk = await getDiskSpace();
                    await reply(`💾 Disk Space: ${disk}`);
                    break;
                case "ip":
                    let ipAddress = "N/A";
                    const networkInfo = os.networkInterfaces();
                    Object.keys(networkInfo).forEach(interface => {
                        networkInfo[interface].forEach(details => {
                            if (details.family === 'IPv4' && !details.internal) {
                                ipAddress = details.address;
                            }
                        });
                    });
                    await reply(`🌐 IP Address: ${ipAddress}`);
                    break;
                default:
                    break;
            }
        }

    } catch (e) {
        console.error("Sysinfo Button Command Error:", e);
        await reply("❌ Failed to fetch system details. Please try again later.");
    }
});

// CPU usage helper
async function getCpuUsage() {
    const start = speed();
    const startCpu = os.cpus().map(cpu => cpu.times);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const end = speed();
    const endCpu = os.cpus().map(cpu => cpu.times);

    const cpuUsage = endCpu.map((cpu, i) => {
        const startTotal = Object.values(startCpu[i]).reduce((a, b) => a + b, 0);
        const endTotal = Object.values(cpu).reduce((a, b) => a + b, 0);
        const totalDiff = endTotal - startTotal;
        const idleDiff = cpu.idle - startCpu[i].idle;
        return Math.round(100 - (idleDiff / totalDiff) * 100);
    });

    return cpuUsage.reduce((a, b) => a + b, 0) / cpuUsage.length;
}

// Disk space helper
async function getDiskSpace() {
    return new Promise((resolve) => {
        exec("df -h /", (error, stdout) => {
            if (error) return resolve("N/A");
            const lines = stdout.trim().split("\n");
            if (lines.length > 1) {
                const parts = lines[1].split(/\s+/);
                resolve(`${parts[2]}B used / ${parts[1]}B total (${parts[4]})`);
            } else {
                resolve("N/A");
            }
        });
    });
}
