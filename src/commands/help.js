const CommandManager = require('../command')

module.exports = ({ message }) => {
  const commands = [...CommandManager.i.getRegisteredCommands()]
  message.author.send(`Commandes disponibles : \n!${commands.join('\n!')}`)
  return message.delete()
}
