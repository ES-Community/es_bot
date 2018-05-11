const CommandManager = require('../command')

module.exports = ({ message }) => {
  const commands = [...CommandManager.i.getRegisteredCommands()]
  message.channel.send(`All commands available are:\n!${commands.join('\n!')}`)
}
