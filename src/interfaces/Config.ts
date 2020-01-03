export default interface Config {
  discord: DiscordConfig
  twitter: TwitterConfig
}

interface DiscordConfig {
  token: string
  presentationChannel: string
  logsChannel: string
  tweetChannel: string
}

interface TwitterConfig {
  users: string[]
  feeds: string[]
  consumerKey: string
  secretKey: string
  accessToken: string
  secretToken: string
}