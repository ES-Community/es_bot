import ESCape from "./ESCape"

const bot = new ESCape().init()

process.on('SIGINT', () => {
  bot.client.destroy()
})