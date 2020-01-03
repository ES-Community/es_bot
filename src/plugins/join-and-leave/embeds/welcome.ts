import { RichEmbed } from 'discord.js'

export default new RichEmbed()
  .setTitle('Bienvenue !')
  .setThumbnail('https://i.imgur.com/tjLDSiW.png')
  .setDescription(`
    Bienvenue sur le serveur Discord de la communauté ECMAScript francophone.
    Pour devenir membre, je t'invite à faire un tour sur les liens ci-dessous et à te présenter dans le channel adéquat.
    Une fois que tu te seras présenté et qu'un mentor aura validé ta présentation, tu pourras accéder à l'entièreté des channels.
    Au plaisir :)
  `)
  .addField(
    'Code de conduite',
    '[https://git.io/vpDVF](https://git.io/vpDVF)'
  )
  .addField(
    'Aide',
    '[https://git.io/vpDVx](https://git.io/vpDVx)'
  )