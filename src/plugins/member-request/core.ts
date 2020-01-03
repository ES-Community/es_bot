import { Message, MessageReaction, User } from 'discord.js'
import cloneDeep from 'lodash.clonedeep'

import ESCape from '../../ESCape'

import presentationEmbed from './embeds/presentation'

const requestsInitiated: {[key: string]: Presentation} = {}

const emptyPresentation: Presentation = { 
  metadatas: {
    readCodeOfConductSnowflake: message.id,
  },
  job: undefined,
  experience: undefined,
  devWebProfiles: undefined,
  jsTime: undefined,
  foundCommunity: undefined,
  freeComment: undefined
}

export default function MemberRequest(bot: ESCape) {
  return {
    events: [
      {
        type: 'on',
        name: 'messageDelete',
        handler: async (messageDel: Message) => {
          const message = await messageDel.author.send('As-tu lu le code de conduite ?') as Message
          message.react('✅')
          
          requestsInitiated[messageDel.author.id] = cloneDeep(emptyPresentation)
        }
      }, {
        type: 'on',
        name: 'messageReactionAdd',
        handler: async (messageReaction: MessageReaction, user: User) => {
          if(messageReaction.message.channel.type !== 'dm') return
          if(messageReaction.message.id === requestsInitiated[user.id].metadatas.readCodeOfConductSnowflake) {
            user.send('Veuillez répondre aux questions qui suivent (un seul message par réponse). Une fois ceci fait, un mentor de la communauté les lira et vous donnera les permissions nécessaires à l\'accès au reste du serveur.')
            user.send('Quel est votre métier actuel ?')
          }
        }
      }, {
        type: 'on',
        name: 'message',
        handler: async (message: Message) => {
          if(message.content === '!reset') {
            const message = await message.author.send('As-tu lu le code de conduite ?') as Message
            message.react('✅')
            
            requestsInitiated[message.author.id] = cloneDeep(emptyPresentation)
          }
          
          if(message.channel.type !== 'dm') return
          if(message.author.bot === true) return

          const presentation = requestsInitiated[message.author.id] || cloneDeep(emptyPresentation)
          if(presentation == undefined) return message.author.send('Echec. Envoyez la commande !reset et ré-essayez.')
          
          if(presentation.job == undefined) {
            presentation.job = message.content
            return message.author.send('Décrivez votre expérience avec le développement et vos préférences en terme de langages et de technologies.')
          }
          if(presentation.experience == undefined) {
            presentation.experience = message.content
            return message.author.send('Avez-vous un profil GitHub, GitLab ou Bitbucket que vous souhaiteriez partager avec les membres de la communauté ?')
          }
          if(presentation.devWebProfiles == undefined) {
            presentation.devWebProfiles = message.content
            return message.author.send('Depuis combien de vous faites-vous du développement JavaScript ? (amateur ou professionnel)')
          }
          if(presentation.jsTime == undefined) {
            presentation.jsTime = message.content
            return message.author.send('Finalement, comment avez-vous découvert notre communauté ?')
          }
          if(presentation.foundCommunity == undefined) {
            presentation.foundCommunity = message.content
            return message.author.send('Avez-vous un commentaire supplémentaire à faire ?')
          }
          if(presentation.freeComment == undefined) {
            presentation.freeComment = message.content
            message.author.send('Merci beaucoup ! Un mentor validera votre présentation prochainement.')
          }
          return bot.presentationChannel.send(presentationEmbed(message.author, presentation))
        }
      }
    ]
  }
}