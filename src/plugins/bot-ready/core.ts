import readyEmbed from './embeds/ready'

import ESCape from '../../ESCape'

export default function BotReady(bot: ESCape) {
  return {
    events: [
      {
        type: 'once',
        name: 'ready',
        handler: () => {
          console.log(`Logged in as ${bot.client.user.tag}`)
          bot.logChannel.send(readyEmbed)
        }
      }   
    ]
  }
}