const fs = require('fs');
const path = require('path');

// Global commands array
global.commands = global.commands || [];

// Plugin loader
function loadPlugins() {
    const pluginDir = path.join(__dirname, 'plugins');
    if (!fs.existsSync(pluginDir)) return;

    fs.readdirSync(pluginDir).forEach(file => {
        if (file.endsWith('.js')) {
            const cmdPattern = path.basename(file, '.js');
            if (!global.commands.find(c => c.pattern === cmdPattern)) {
                try {
                    const cmd = require(`./plugins/${file}`);
                    global.commands.push({ pattern: cmdPattern, function: cmd });
                    console.log(`✅ Loaded plugin: ${file}`);
                } catch (err) {
                    console.error(`❌ Failed to load plugin: ${file}`, err);
                }
            }
        }
    });
}

// Export function
module.exports = { loadPlugins };
