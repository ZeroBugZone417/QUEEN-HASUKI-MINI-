// Array to store all registered commands
const commands = [];

/**
 * Register a new command
 * @param {Object} options - Command options
 * @param {Function} handler - Command handler function
 */
function cmd({ pattern, alias = [], desc = "", category = "", filename, use }, handler) {
    commands.push({ pattern, alias, desc, category, filename, use, handler });
}

/**
 * Get all registered commands
 * @returns {Array} commands
 */
function getCommands() {
    return commands;
}

module.exports = { cmd, getCommands };
