const Twit = require('twit')
const is = require('@sindresorhus/is')
const config = require('../../config/prod.json')

const TwitterAPI = new Twit({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
})

/**
 * @class TwitterPlugin
 * @classdesc Manage twitter feed
 */
class TwitterPlugin {
  /**
   * @public
   * @method init
   * @desc Init the tweet handler
   * @memberof TwitterPlugin#
   *
   * @param {!Object} channel the channel where to post feed
   *
   * @return {CommandManager}
   */
  static init (channel) {
    if (TwitterPlugin.initialized === true) {
      return
    }
    TwitterPlugin.initialized = true;
    TwitterPlugin.channel = channel
    TwitterPlugin.twitterNames = new Set(config.twitter_users)

    TwitterPlugin.twitterStream = TwitterAPI.stream('statuses/filter', {
      track: config.twitter_feeds.join(',')
    })

    TwitterPlugin.twitterStream.on('tweet', TwitterPlugin.handleTweet)
    process.on('SIGINT', () => {
      TwitterPlugin.twitterStream.stop()
    })
  }

  /**
   * @public
   * @method handleTweet
   * @desc Handle an incoming tweet
   * @memberof TwitterPlugin#
   *
   * @param {!Object} tweet the tweet to handle
   *
   * @return {CommandManager}
   */
  static handleTweet (tweet) {
    /* eslint-disable camelcase */
    const inReplyToScreenName = tweet.in_reply_to_screen_name
    const screenName = tweet.user.screen_name
    const retweetedStatus = tweet.retweeted_status
    const isQuoteStatus = tweet.is_quote_status
    const idStr = tweet.id_str
    /* eslint-enable camelcase */

    if (!TwitterPlugin.twitterNames.has(screenName)) return
    if (!is.nullOrUndefined(inReplyToScreenName) || is(retweetedStatus) !== 'undefined' || isQuoteStatus === true) return
    if (is(TwitterPlugin.channel) !== 'undefined') {
      TwitterPlugin.channel.send(`https://twitter.com/${screenName}/status/${idStr}`)
    }
  }
}

module.exports = TwitterPlugin
