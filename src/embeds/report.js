const Discord = require('discord.js')

module.exports = (message, reportedUser, reason) => new Discord.RichEmbed()
  .setAuthor(message.member.displayName, message.author.avatarURL)
  .setColor(0xFF3333)
  .addField('[:rotating_light: SIGNALEMENT]', `L'utilisateur \`${reportedUser.displayName}\` (\`@${reportedUser.user.tag}\`) a été signalé`)
  .addField('Raison:', reason || '`non définie`')
  .setTimestamp(new Date(message.createdTimestamp).toISOString())
