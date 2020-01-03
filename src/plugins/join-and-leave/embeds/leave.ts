import { RichEmbed } from 'discord.js'

export default function leave(username: string) {
  return new RichEmbed()
    .setTitle('Membre parti')
    .setDescription(`${username} est parti.`)
}
