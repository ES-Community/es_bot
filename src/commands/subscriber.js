const Loki = require('lokijs')
const path = require('path')
const config = require('../../config/prod.json')

const dbPath = path.join(path.dirname(require.main.filename), config.subscriber.dbPath)
const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  autoloadCallback: () => {
    subs = db.getCollection('subscribers')
  }
})

let subs = null

module.exports.subscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChannel = subs.findOne({
      channel: message.channel.name
    })
    if (subscribedChannel !== null) {
      return message.reply(`${message.author.username} already have subscribed to the channel \`#${message.channel.name}\``)
    }
    subs.insert({
      userId: message.author.id,
      channel: message.channel.name
    })
    return message.reply(`${message.author.username} has subscribed to the channel \`#${message.channel.name}\``)
  }
  if (args[0] === 'list') {
    const subscribedChannels = subs.find({
      userId: message.author.id
    })
    if (subscribedChannels.length === 0) return message.reply('You haven\'t subscribed to a channel')
    return message.reply(`You have subscribed to this channels :\n${subscribedChannels.map(a => `\`#${a.channel}\``).join('\n')}`)
  }
}

module.exports.unsubscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChannel = subs.findOne({
      channel: message.channel.name
    })
    if (subscribedChannel !== null) {
      subs.remove(subscribedChannel)
      return message.reply(`${message.author.username} has subscribed to the channel \`#${message.channel.name}\``)
    }
    return message.reply(`${message.author.username} hasn't subscribed to the channel \`#${message.channel.name}\``)
  }
}

module.exports.alert = ({
  message,
  args
}) => {
  if (args.length === 0) {
    return message.reply(`Please, add a message.`)
  }
  const subscribersOnChannel = subs.find({
    channel: message.channel.name
  })
  if (subscribersOnChannel.length === 0) {
    return message.reply(`There is no subscribers for this channel.`)
  }
  const userIds = subscribersOnChannel.map(a => a.userId)
  console.log(userIds)
  return message.reply(userIds.map(id => `<@${id}>`).join(', '))
}
