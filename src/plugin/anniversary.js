const cron = require('node-cron')

/**
 * @class AnniversaryPlugin
 * @classdesc Send anniversary message for members
 */
class AnniversaryPlugin {
  /**
   * @public
   * @method init
   * @desc init the cron anniversary app
   * @memberof AnniversaryPlugin
   *
   * @param {Guild} guild Server where to apply the plugin
   */
  static init (guild) {
    // every day at 10am
    cron.schedule('0 10 * * *', () => {
      guild.members
        .filter(m => !m.user.bot && AnniversaryPlugin.isToday(m.joinedAt))
        .array().forEach(m => {
          const age = (new Date()).getUTCFullYear() - m.joinedAt.getUTCFullYear()
          if (m.id === guild.ownerID) {
            guild.channels.find('name', 'annonces').send(`La communauté fête ses ${age} ans !`)
          }
          if (age === 1) m.send(':birthday: Déjà 1 an que tu es sur la communauté ! :vulcan:')
          else m.send(`:birthday: La viellesse arrive, ça fait ${age} ans que tu es arrivé sur l'ESCommunity :vulcan:`)
        })
    })
  }
  /**
   * @public
   * @method isToday
   * @desc Check if today is the big day
   * @memberof AnniversaryPlugin
   *
   * @param {Date} date The date to check
   *
   * @return {boolean}
   */
  static isToday (date) {
    const now = new Date()
    return (
      now.getFullYear() - date.getFullYear() > 0 &&
      now.getUTCMonth() === date.getUTCMonth() &&
      now.getUTCDate() === date.getUTCDate()
    )
  }
}

module.exports = AnniversaryPlugin
