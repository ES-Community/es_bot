const config = require('../../config/prod.json')
const reportEmbed = require('../embeds/report')

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
    const embed = () => reportEmbed(message, reportedUser, reason.join(' '))
    reportedUser.send(embed())
    message.guild.channels.find('name', 'mentors').send(embed())
    message.author.send(embed())
    message.delete()
  }).catch(e => {
    message.author.send('Impossible de signaler un utilisateur actuellement.')
    console.error(e)
    message.delete()
  })
}
