const messageFormat = /^\*\*\[\s.*\s\]\*\*\s.*/

module.exports = {
  channelName: 'liens',
  handler: function (message) {
    if (message.content.match(messageFormat) === true) return
    message.delete()
    message.member.send('Le format de votre message est invalide (Merci de le corriger). Exemple => **[ titre et icons ]** Description et lien(s)')
  }
}
