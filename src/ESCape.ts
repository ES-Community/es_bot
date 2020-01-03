import fs from 'fs'
import path from 'path'

import Discord, { TextChannel } from 'discord.js'

import loadConfig from './config'
import Config from './interfaces/Config';

export default class ESCape {
  
  client!: Discord.Client;

  config: Config = loadConfig()

  events: { type: 'on'|'once', name: string, handler: Function }[] = [
    {
      type: 'once',
      name: 'ready',
      handler: () => {
        this.logChannel = this.client.channels.get(this.config.discord.logsChannel) as TextChannel
        this.tweetChannel = this.client.channels.get(this.config.discord.tweetChannel) as TextChannel
        this.presentationChannel = this.client.channels.get(this.config.discord.presentationChannel) as TextChannel
      }
    }
  ]

  logChannel!: TextChannel
  tweetChannel!: TextChannel
  presentationChannel!: TextChannel

  loadPlugins () {
    const pluginPath = path.join(process.cwd(), 'build', 'plugins')
    const plugins = fs.readdirSync(pluginPath)
    plugins.forEach(plugin => {
      const pluginContent = require(path.join(pluginPath, plugin, 'core.js')).default(this)
      
      if(pluginContent.events != undefined && pluginContent.events.length > 0) {
        this.events.push(...pluginContent.events)
      }

      if(pluginContent.class != undefined){
        pluginContent.class.init(this)
      }
    })
  }

  init(){
    this.client = new Discord.Client()

    this.loadPlugins()
    this.events.forEach(({ type, name, handler }) => this.client[type](name, handler))
    console.log(this.events)
    this.client.login(this.config.discord.token)
    
    return this
  }
}
