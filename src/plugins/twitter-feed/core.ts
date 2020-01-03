import Twit from 'twit'

import ESCape from '../../ESCape'

class TwitterPlugin {
  static bot: ESCape

  static channel: string
  static twitterNames: Set<string>
  static twitterStream: Twit.Stream
  static twitterAPI: Twit

  static init(bot: ESCape){
    TwitterPlugin.bot = bot

    TwitterPlugin.twitterAPI = new Twit({
      consumer_key: bot.config.twitter.consumerKey,
      consumer_secret: bot.config.twitter.secretKey,
      access_token: bot.config.twitter.accessToken,
      access_token_secret: bot.config.twitter.secretToken
    })

    TwitterPlugin.twitterNames = new Set(bot.config.twitter.users)
    TwitterPlugin.twitterStream = TwitterPlugin.twitterAPI.stream('statuses/filter', {
      track: bot.config.twitter.feeds
    })

    TwitterPlugin.twitterStream.on('tweet', TwitterPlugin.handleTweet)
    process.on('SIGINT', () => {
      TwitterPlugin.twitterStream.stop()
    })
  }

  static handleTweet (tweet: Twit.Twitter.Status) {
    const inReplyToScreenName = tweet.in_reply_to_screen_name
    const screenName = tweet.user.screen_name
    const retweetedStatus = tweet.retweeted_status
    const quotedStatus = tweet.quoted_status
    const idStr = tweet.id_str

    if (!TwitterPlugin.twitterNames.has(screenName)) return
    if (inReplyToScreenName != undefined || retweetedStatus != undefined || quotedStatus != undefined) return

    TwitterPlugin.bot.tweetChannel.send(`https://twitter.com/${screenName}/status/${idStr}`)
  }
}

export default function Twitter() {
  return {
    class: TwitterPlugin
  }
}