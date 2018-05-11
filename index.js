const Event = require('events')
const Discord = require('discord.js')

const CommandManager = require('./src/command')
const TwitterPlugin = require('./src/plugin/twitter')
const ruleLiens = require('./src/rules/liens')
const docCmd = require('./src/commands/doc')
const helpCmd = require('./src/commands/help')
const welcomeEmbed = require('./src/embeds/welcome')
const joinLeftEmbed = require('./src/embeds/welcome')

const CM = CommandManager.init()
CM.addCommand('doc', docCmd)
CM.addCommand('help', helpCmd)

const RM = new Event()
RM.on(ruleLiens.channelName, ruleLiens.handler)

const ESBot = new Discord.Client()

ESBot.on('ready', () => {
  const { channels } = ESBot

  TwitterPlugin.init(channels.find('name', 'tweets'))

  ESBot.guilds.first().members.find('nickname', 'Xavier').send(welcomeEmbed)

  console.log('ES Bot up and ready')
})

ESBot.on('guildMemberAdd', member => {
  member.send(welcomeEmbed)
  ESBot.channels.find('name', 'logs').send(joinLeftEmbed.join(member.nickname))
})
ESBot.on('guildMemberRemove', member => {
  ESBot.channels.find('name', 'logs').send(joinLeftEmbed.left(member.nickname))
})
ESBot.on('message', message => {
  CM.messageHandler(message)
  const channelName = message.channel.name
  RM.emit(channelName, message.content)
})
ESBot.on('messageUpdate', message => {
  CM.messageHandler(message)
  const channelName = message.channel.name
  RM.emit(channelName, message.content)
})
ESBot.login(process.env.DISCORD_TOKEN)

process.on('SIGINT', () => {
  ESBot.destroy()
})
