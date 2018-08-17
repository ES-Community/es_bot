const Discord = require('discord.js')

module.exports = async (message, reportedUser, reason) => new Discord.RichEmbed()
  .setAuthor(`${message.member.displayName} (@${message.author.tag})`, message.author.avatarURL)
  .setColor(0xFF3333)
  .addField('[:rotating_light: SIGNALEMENT]', `L'utilisateur \`${reportedUser.displayName}\` (\`@${reportedUser.user.tag}\`) a été signalé dans le salon \`#${message.channel.name}\``)
  .addField('Raison:', reason || '`non définie`')
  .addField(`Deriners message de ${reportedUser.displayName} dans \`#${message.channel.name}\``,
    (await message.channel.fetchMessages())
      .filter(m => m.author.id === reportedUser.user.id)
      .array()
      .slice(0, 5)
      .reverse()
      .map(m => `\`${
        m.createdAt.toLocaleString('fr-fr',
          {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
          })
      }\` ${m.cleanContent}`)
      .join('\n') || '`Aucun message` :thinking:'
  )
  .setTimestamp(new Date(message.createdTimestamp).toISOString())
