const Event = require('events')
const Discord = require('discord.js')

const CommandManager = require('./src/command')
const TwitterPlugin = require('./src/plugin/twitter')
const docCmd = require('./src/commands/doc')
const helpCmd = require('./src/commands/help')
const welcomeEmbed = require('./src/embeds/welcome')
const joinLeftEmbed = require('./src/embeds/join-left')

const CM = CommandManager.init()
CM.addCommand('doc', docCmd)
CM.addCommand('help', helpCmd)

const RM = new Event()

const ESBot = new Discord.Client()

ESBot.once('ready', () => {
  TwitterPlugin.init(ESBot.channels.find('name', 'tweets'))

  console.log('ES Bot up and ready')
})

ESBot.on('guildMemberAdd', member => {
  member.send(welcomeEmbed)
  ESBot.channels.find('name', 'logs').send(joinLeftEmbed.join(member.displayName))
})
ESBot.on('guildMemberRemove', member => {
  ESBot.channels.find('name', 'logs').send(joinLeftEmbed.left(member.displayName))
})
ESBot.on('message', message => {
  CM.messageHandler(message)
  RM.emit(message.channel.name, message)
})
ESBot.on('messageUpdate', message => {
  CM.messageHandler(message)
  RM.emit(message.channel.name, message)
})
ESBot.login(process.env.DISCORD_TOKEN)

process.on('SIGINT', () => {
  ESBot.destroy()
})
