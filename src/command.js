// Require Node.JS Dependencies
const events = require("events");

// Require NPM Dependencies
const is = require("@sindresorhus/is");

/**
 * @class CommandManager
 * @classdesc Manage Discord command!
 * @extends events
 *
 * @property {Map<String,Function>} commandsRegistery
 */
class CommandManager extends events {

    /**
     * @constructor
     */
    constructor() {
        super();
        this.commandsRegistery = new Map();
    }

    /**
     * @public
     * @method addCommand
     * @desc Add a new command to the bot
     * @memberof CommandManager#
     *
     * @param {!String} commandName commandName
     * @param {!Function} callback callback to execute
     *
     * @return {void}
     * @throws {TypeError}
     */
    addCommand(commandName, callback) {
        if (is(commandName) !== "string") {
            throw new TypeError("commandName should be typeof String");
        }
        if (is(callback) !== "Function") {
            throw new TypeError("callback should be instanceof Function");
        }
        const fullCMDName = `command_${commandName}`;
        this.commandsRegistery.set(commandName, fullCMDName);
        this.on(fullCMDName, callback);
    }

    /**
     * @public
     * @method getRegisteredCommands
     * @desc Get the list of all commands registered
     * @memberof CommandManager#
     *
     * @return {String[]}
     */
    getRegisteredCommands() {
        return this.commandsRegistery.keys();
    }

    /**
     * @public
     * @method getRegisteredCommands
     * @desc Get the list of all commands registered
     * @memberof CommandManager#
     *
     * @param {!Object} message message to handle
     * @param {!String} commandName commandName (str) to find
     * @param {!any} args commands arguments for the callback
     *
     * @return {void}
     */
    handle(message, commandName, args) {
        this.emit(`command_${commandName}`, { message, args });
    }

}

// Export class
module.exports = CommandManager;
