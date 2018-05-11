const Event = require('events')
const is = require('@sindresorhus/is')
const config = require('../config/prod.json')

/**
 * @class CommandManager
 * @classdesc Manage Discord command!
 * @extends events
 *
 * @property {Map<String,Function>} commandsRegistery
 */
class CommandManager extends Event {
  /**
   * @constructor
   */
  constructor () {
    super()
    this.commandsRegistery = new Map()
  }

  /**
   * @public
   * @method init
   * @desc Init the command manager
   * @memberof CommandManager#
   * @return {CommandManager}
   */
  static init () {
    CommandManager.i = new CommandManager()
    return CommandManager.i
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
  addCommand (commandName, callback) {
    if (is(commandName) !== 'string') {
      throw new TypeError('commandName should be typeof String')
    }
    if (is(callback) !== 'Function') {
      throw new TypeError('callback should be instanceof Function')
    }
    const fullCMDName = `command_${commandName}`
    this.commandsRegistery.set(commandName, fullCMDName)
    this.on(fullCMDName, callback)
  }

  /**
   * @public
   * @method getRegisteredCommands
   * @desc Get the list of all commands registered
   * @memberof CommandManager#
   *
   * @return {String[]}
   */
  getRegisteredCommands () {
    return this.commandsRegistery.keys()
  }

  /**
   * @public
   * @method handle
   * @desc Emit the message handle
   * @memberof CommandManager#
   *
   * @param {!Object} message message to handle
   * @param {!String} commandName commandName (str) to find
   * @param {!any} args commands arguments for the callback
   *
   * @return {void}
   */
  handle (message, commandName, args) {
    this.emit(`command_${commandName}`, { message, args })
  }

  /**
   * @public
   * @method messageHandler
   * @desc Handle the message
   * @memberof CommandManager#
   *
   * @param {!Object} message message to handle
   *
   * @return {void}
   */
  messageHandler (message) {
    const {
      content
    } = message
    if (content[0] === config.command_char) {
      try {
        const [, cmd, argStr] = /^!([a-z]+)\s*(.*)/.exec(content)

        return CommandManager.i.handle(message, cmd, argStr.split(' ').filter((val) => val !== ''))
      } catch (error) {
        return console.error(error)
      }
    }
  }
}

// Export class
module.exports = CommandManager
