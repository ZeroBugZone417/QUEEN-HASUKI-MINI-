const fs = require('fs');
const path = require('path');

global.commands = []; // reset commands array

function loadPlugins() {
    const pluginDir = path.join(__dirname, 'plugins');
    if (!fs.existsSync(pluginDir)) return console.log('⚠️ Plugin folder not found!');

    const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
    for (const file of files) {
        try {
            const cmdPattern = file.replace('.js', '');
            const cmdFunc = require(path.join(pluginDir, file));

            // check duplicates
            if (!global.commands.find(c => c.pattern === cmdPattern)) {
                global.commands.push({ pattern: cmdPattern, function: cmdFunc });
                console.log(`✅ Loaded plugin: ${file}`);
            }
        } catch (err) {
            console.error(`❌ Failed to load plugin: ${file}`, err);
        }
    }
}

module.exports = { loadPlugins };

