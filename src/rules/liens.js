const messageFormat = /^\*\*\[\s.*\s\]\*\*\s.*/

module.exports = {
  channelName: 'liens',
  handler: async function (message) {
    if (message.content.match(messageFormat) === true) return
    const warnMessage = await message.reply('Le format de votre message est invalide (Merci de le corriger). Exemple => **[ titre et icons ]** Description et lien(s)')
    warnMessage.delete(30000)
  }
}
