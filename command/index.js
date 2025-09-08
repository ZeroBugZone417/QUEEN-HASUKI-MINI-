// command/index.js
const fs = require('fs');
const path = require('path');

// Initialize global commands array
if (!global.commands) global.commands = [];

/**
 * Load all command plugins from /commands folder
 */
function loadCommands() {
    const commandPath = path.join(__dirname, 'commands'); // commands folder
    const files = fs.readdirSync(commandPath).filter(f => f.endsWith('.js'));

    for (const file of files) {
        try {
            const command = require(path.join(commandPath, file));
            if (command && command.pattern && typeof command.function === 'function') {
                global.commands.push(command);
                console.log(`✅ Loaded command: ${command.pattern}`);
            }
        } catch (err) {
            console.error(`❌ Failed to load command ${file}:`, err);
        }
    }
}

module.exports = { loadCommands };
