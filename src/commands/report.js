const config = require('../../config/prod.json')

module.exports.report = ({
  message,
  args: [userString, ...reason]
}) => {
  if (message.member.roles.find('name', config.roles.member) === null) {
    message.author.send(`Vous devez être membre pour signaler un utilisateur.`)
    return message.delete()
  }
  if (userString === undefined) {
    message.author.send(`Vous devez spécifier un utilisateur pour le signaler.`)
    return message.delete()
  }
  const userMatch = userString.match(/<@!?(\d{18})>/)
  if (userMatch === null) {
    message.author.send(`Vous devez spécifier un utilisateur avec \`@username\` pour le signaler.`)
    return message.delete()
  }
  const reportedUser = message.guild.members.find('id', userMatch[1])
  if (reportedUser === null) {
    message.author.send(`L'utilisateur avec l'id \`${userMatch[1]}\` n'a pas été trouvé dans la liste des membres.`)
    return message.delete()
  }
  if (reportedUser.roles.find('name', config.roles.moderator) !== null) {
    message.author.send(`Vous ne pouvez pas signaler un mentor !`)
    reportedUser.send(`\`${message.author.tag}\` attaque REPORT pour la raison suivante :\n${reason.join(' ')}\nCe n'est pas très efficace... Ce type d'attaque ne fonctionne pas avec les mentors...`)
    return message.delete()
  }

  reportedUser.addRole(message.guild.roles.find('name', config.roles.reported)).then(() => {
    reportedUser.send(`[SIGNALEMENT] Vous avez été signalé par \`${message.author.tag}\` pour la raison suivante :\n${reason.join(' ')}\nVeuillez contacter un mentor pour réclamation.`)
    message.channels.find('name', 'mentors').send(`[SIGNALEMENT] \`${message.author.tag}\` a signalé \`${reportedUser.user.tag}\` pour la raison suivante :\n${reason.join(' ')}`)
    message.author.send(`L'utilisateur \`${reportedUser.user.tag}\` a été signalé pour la raison suivante :\n${reason.join(' ')}`)
    message.delete()
  }).catch(e => {
    message.author.send('Impossible de signaler un utilisateur actuellement.')
    console.error(e)
    message.delete()
  })
}

module.exports.unlock = ({
  message,
  args: [userString, ...args]
}) => {
  if (message.member.roles.find('name', config.roles.moderator) === null) {
    message.author.send(`Vous devez être un mentor pour débloquer un utilisateur.`)
    return message.delete()
  }
  if (userString === undefined) {
    message.author.send(`Vous devez spécifier un utilisateur.`)
    return message.delete()
  }
  const userMatch = userString.match(/<@!?(\d{18})>/)
  if (userMatch === null) {
    message.author.send(`Vous devez spécifier un utilisateur avec \`@username\`.`)
    return message.delete()
  }
  const reportedUser = message.guild.members.find('id', userMatch[1])
  if (reportedUser === null) {
    message.author.send(`L'utilisateur avec l'id \`${userMatch[1]}\` n'a pas été trouvé dans la liste des membres.`)
    return message.delete()
  }
  if (!reportedUser.roles.exists('name', config.roles.reported)) {
    message.author.send(`L'utilisateur \`${reportedUser.user.tag}\` n'est pas signalé.`)
    return message.delete()
  }
  reportedUser.removeRole(message.guild.roles.find('name', config.roles.reported)).then(() => {
    reportedUser.send('Vous êtes à nouveau membre :heart:')
    message.author.send(`L'utilisateur \`${reportedUser.user.tag}\` a été réintégré.`)
    message.delete()
  }).catch(e => {
    message.author.send(`L'utilisateur \`${reportedUser.user.tag}\` doit être réintégré à la main.`)
    console.error(e)
    message.delete()
  })
}
