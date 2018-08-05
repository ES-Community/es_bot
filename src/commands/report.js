module.exports.report = ({
  message,
  args: [userString, ...reason]
}) => {
  if (message.member.roles.find('name', 'Communauté') === null) {
    message.author.send(`Vous devez être membre pour signaler un utilisateur.`)
    return message.delete()
  }
  if (userString === undefined) {
    message.author.send(`Vous devez spécifier un utilisateur pour le signaler.`)
    return message.delete()
  }
  const userMatch = userString.match(/<@(\d{18}>)/)
  if (userMatch === null) {
    message.author.send(`Vous devez spécifier un utilisateur en le référançant avec \`@username\` pour le signaler.`)
    return message.delete()
  }
  const reportedUser = message.guild.members.find('id', userMatch[1])
  if (reportedUser === null) {
    message.author.send(`L'utilisateur avec l'id \`${userMatch[1]}\` n'a pas été trouvé dans la liste de membre`)
    return message.delete()
  }
  if (reportedUser.roles.find('name', 'Mentor') !== null) {
    message.author.send(`Vous ne pouvez pas signaler un mentor !`)
    reportedUser.send(`${message.author.tag} attaque REPORT pour la raison suivante :\n${reason.join(' ')}\nCe n'est pas très efficace... Ce type d'attaque ne fonctionne pas avec les mentors...`)
    return message.delete()
  }
  reportedUser.setMute(true, reason.join(' '))
  reportedUser.send(`[SIGNALEMENT] Vous avez été signalé par ${reportedUser.user.tag} pour la raison suivante :\n${reason.join(' ')}\nVeuillez contacter un mentor pour réclamation`)
  message.guild.members
    .filter(m => m.roles.find('name', 'Mentor') !== null)
    .array().forEach(m =>
      m.send(`[SIGNALEMENT] ${message.author.tag} a signalé ${reportedUser.user.tag} pour la raison suivante :\n${reason.join(' ')}`)
    )
  message.author.send(`L'utilisateur \`${reportedUser.user.tag}\` a été signaler pour la raison suivante :\n${reason.join(' ')}`)
  return message.delete()
}

module.exports.unlock = ({
  message,
  args: [userString, ...args]
}) => {
  if (message.member.roles.find('name', 'Mentor') === null) {
    message.author.send(`Vous devez être un mentor pour déblocker un utilisateur.`)
    return message.delete()
  }
  if (userString === undefined) {
    message.author.send(`Vous devez spécifier un utilisateur.`)
    return message.delete()
  }
  const userMatch = userString.match(/<@(\d{18}>)/)
  if (userMatch === null) {
    message.author.send(`Vous devez spécifier un utilisateur en le référançant avec \`@username\`.`)
    return message.delete()
  }
  const reportedUser = message.guild.members.find('id', userMatch[1])
  if (reportedUser === null) {
    message.author.send(`L'utilisateur avec l'id \`${userMatch[1]}\` n'a pas été trouvé dans la liste de membre`)
    return message.delete()
  }
  reportedUser.setMute(false)
  reportedUser.send('Vous avez été démute :heart:')
  message.author.send(`L'utilisateur \`${reportedUser.user.tag}\` a été démute.`)
  return message.delete()
}
