const NoDB = require('nodbstore')
const NoDBStoreGist = require('nodbstore-gist')

const db = new NoDB()
const store = new NoDBStoreGist({
  name: 'subscriber'
})

db.addStore(store)
store.load().then(() => console.log('Database loaded'))

module.exports.subscribe = ({
  message,
  args
}) => {
  if (args.length === 0) {
    const subscribedChannel = db.findOne(s => (
      s.userId === message.author.id &&
      s.channel === message.channel.name
    ))
    if (subscribedChannel !== null) {
      message.author.send(`Vous êtes déjà abonné au channel \`#${message.channel.name}\``)
      return message.delete()
    }
    db.put({
      userId: message.author.id,
      channel: message.channel.name
    })
    message.author.send(`Vous vous êtes abonné au channel \`#${message.channel.name}\``)
    return message.delete()
  }
  if (args[0] === 'list') {
    const subscribedChannels = db.find(s => (
      s.userId === message.author.id
    ))
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
    const subscribedChannel = db.findOne(s => (
      s.userId === message.author.id &&
      s.channel === message.channel.name
    ))
    if (subscribedChannel !== null) {
      db.remove(subscribedChannel._id)
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
  if (!message.member.roles.find('name', 'Mentor')) {
    return message.delete()
  }
  if (args.length === 0) {
    message.author.send(`Veuillez mettre un message à votre alerte : \`alert <message>\` `)
    return message.delete()
  }
  const subscribersOnChannel = db.find(s => (
    s.channel === message.channel.name
  ))
  if (subscribersOnChannel.length === 0) {
    message.channel.send(`${args.join(' ')}\nIl n'y a pas d'abonné à ce channel...`)
    return message.delete()
  }
  message.channel.send(`${args.join(' ')}\n${subscribersOnChannel.map(sub => `<@${sub.userId}>`).join(', ')}`)
  return message.delete()
}
