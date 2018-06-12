const Loki = require('lokijs')

const dbPath = process.env.LOKI_DB_PATH

const db = new Loki(dbPath, {
  autoload: true,
  autosave: true,
  autoloadCallback: () => {
    subs = db.getCollection('subscribers')
    if (subs === null) subs = db.addCollection('subscribers')
  }
})

let subs = null

module.exports.subscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChannel = subs.findOne({
      userId: message.author.id,
      channel: message.channel.name
    })
    if (subscribedChannel !== null) {
      message.author.send(`Vous êtes déjà abonné au channel \`#${message.channel.name}\``)
      return message.delete()
    }
    subs.insert({
      userId: message.author.id,
      channel: message.channel.name
    })
    message.author.send(`Vous vous êtes abonné au channel \`#${message.channel.name}\``)
    return message.delete()
  }
  if (args[0] === 'list') {
    const subscribedChannels = subs.find({
      userId: message.author.id
    })
    if (subscribedChannels.length === 0) {
      message.author.send(`Vous n'êtes abonné à aucun channel`)
      return message.delete()
    }
    message.author.send(`Vous êtes abonnés aux channels suivants :\n${subscribedChannels.map(a => `\`#${a.channel}\``).join('\n')}`)
    return message.delete()
  }
}

module.exports.unsubscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChannel = subs.findOne({
      userId: message.author.id,
      channel: message.channel.name
    })
    if (subscribedChannel !== null) {
      subs.remove(subscribedChannel)
      message.author.send(`Vous vous êtes désabonné au channel \`#${message.channel.name}\``)
      return message.delete()
    }
    message.author.send(`Vous n'êtes pas abonné au channel \`#${message.channel.name}\``)
    return message.delete()
  }
}

module.exports.alert = ({
  message,
  args
}) => {
  if (args.length === 0) {
    message.author.send(`Veuillez mettre un message à votre alert : \`!alert <message>\` `)
    return message.delete()
  }
  const subscribersOnChannel = subs.find({
    channel: message.channel.name
  })
  if (subscribersOnChannel.length === 0) {
    message.channel.send(`${args.join(' ')}\nIl n'y a pas d'abonné à ce channel...`)
    return message.delete()
  }
  message.channel.send(`${args.join(' ')}\n${subscribersOnChannel.map(sub => `<@${sub.userId}>`).join(', ')}`)
  return message.delete()
}
