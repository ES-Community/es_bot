import { GuildMember } from 'discord.js'

import ESCape from '../../ESCape'

import welcomeEmbed from './embeds/welcome'
import joinEmbed from './embeds/join'
import leaveEmbed from './embeds/leave'

export default function JoinAndLeave(bot: ESCape) {
  return {
    events: [
      {
        type: 'on',
        name: 'message',
        handler: () => {

        }
      }, {
        type: 'on',
        name: 'guildMemberAdd',
        handler: (member: GuildMember) => {
          member.send(welcomeEmbed)
          bot.logChannel.send(joinEmbed(member.displayName))
        }
      }, {
        type: 'on',
        name: 'guildMemberRemove',
        handler: (member: GuildMember) => {
          bot.logChannel.send(leaveEmbed(member.displayName))
        }
      }     
    ]
  }
}