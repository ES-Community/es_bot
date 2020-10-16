const Discord = require('discord.js')

module.exports = {
  join: (username) => new Discord.RichEmbed()
    .setTitle('Nouveau membre')
    .setDescription(`${username} est arrivé`),
  left: (username) => new Discord.RichEmbed()
    .setTitle('Membre parti')
    .setDescription(`${username} est parti`)
}
