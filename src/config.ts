import fs from 'fs'
import path from 'path'

import toml from 'toml'
import Config from './interfaces/Config'

export default function loadConfig() {
  const tomlConfig = fs.readFileSync(path.join(process.cwd(), 'config', `config.${process.env.PRODUCTION ? 'prod' : 'dev'}.toml`)).toString()

  let config: Config
  
  try {
    config = toml.parse(tomlConfig)
  } catch(err) {
    console.error(`Parsing error on line ${err.line}, column ${err.column}: ${err.message}`)
    process.exit(1)
  }

  return config
}