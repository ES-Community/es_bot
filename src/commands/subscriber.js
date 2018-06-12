const Loki = require('lokijs')
const path = require('path')
const config = require('../../config/prod.json')

const dbPath = path.join(path.dirname(require.main.filename), config.subscriber.dbPath)
const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  loadCallback: () => {
    subs = db.getCollection('subscribers')
  }
})

let subs = null

module.exports.subscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChennel = subs.findOne({
      channel: message.channel.name
    })
    if (subscribedChennel !== null) {
      return message.reply(`${message.author.username} already have subscribed to the channel \`#${message.channel.name}\``)
    }
    subs.insert({
      userId: message.author.id,
      channel: message.channel.name
    })
    return message.reply(`${message.author.username} has subscribed to the channel \`#${message.channel.name}\``)
  }
  if (args[0] === 'list') {
    const subscribedChennels = subs.find({
      userId: message.author.id
    })
    if (subscribedChennels.length === 0) return message.reply('You haven\'t subscribed to a channel')
    return message.reply(`You have subscribed to this channels :\n${subscribedChennels.map(a => `\`#${a.channel}\``).join('\n')}`)
  }
}

module.exports.unsubscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChennel = subs.findOne({
      channel: message.channel.name
    })
    if (subscribedChennel !== null) {
      subs.remove(subscribedChennel)
      return message.reply(`${message.author.username} has subscribed to the channel \`#${message.channel.name}\``)
    }
    return message.reply(`${message.author.username} hasn't subscribed to the channel \`#${message.channel.name}\``)
  }
}
