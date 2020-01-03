import { RichEmbed } from 'discord.js'

export default function join(username: string) {
  return new RichEmbed()
    .setTitle('Nouveau membre')
    .setDescription(`${username} est arrivé.`)
}
