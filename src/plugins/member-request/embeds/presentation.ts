import { RichEmbed, User } from 'discord.js'

export default function(user: User, datas: Presentation) {
  return new RichEmbed()
    .setTitle('Présentation')
    .setThumbnail(user.avatarURL)
    .addField(
      'Utilisateur',
      user.username
    )
    .addField(
      'Métier',
      datas.job
    )
    .addField(
      'Expériences et préférences',
      datas.experience
    )
    .addField(
      'Profiles en ligne',
      datas.devWebProfiles
    )
    .addField(
      'Pratique du JavaScript depuis',
      datas.jsTime
    )
    .addField(
      'Découverte de la communauté',
      datas.foundCommunity
    )
}