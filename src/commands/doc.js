const is = require('@sindresorhus/is')

const documentationLinks = new Map()
documentationLinks.set('node', new Map([
  ['assert', 'https://nodejs.org/api/assert.html'],
  ['buffer', 'https://nodejs.org/api/buffer.html'],
  ['addons', 'https://nodejs.org/api/addons.html'],
  ['async_hooks', 'https://nodejs.org/api/async_hooks.html'],
  ['n-api', 'https://nodejs.org/api/n-api.html'],
  ['child_process', 'https://nodejs.org/api/child_process.html'],
  ['cluster', 'https://nodejs.org/api/cluster.html'],
  ['cli', 'https://nodejs.org/api/cli.html'],
  ['console', 'https://nodejs.org/api/console.html'],
  ['crypto', 'https://nodejs.org/api/crypto.html'],
  ['debugger', 'https://nodejs.org/api/debugger.html'],
  ['deprecations', 'https://nodejs.org/api/deprecations.html'],
  ['dns', 'https://nodejs.org/api/dns.html'],
  ['esm', 'https://nodejs.org/api/esm.html'],
  ['errors', 'https://nodejs.org/api/errors.html'],
  ['events', 'https://nodejs.org/api/events.html'],
  ['fs', 'https://nodejs.org/api/fs.html'],
  ['globals', 'https://nodejs.org/api/globals.html'],
  ['http', 'https://nodejs.org/api/http.html'],
  ['http2', 'https://nodejs.org/api/http2.html'],
  ['https', 'https://nodejs.org/api/https.html'],
  ['inspector', 'https://nodejs.org/api/inspector.html'],
  ['intl', 'https://nodejs.org/api/intl.html'],
  ['modules', 'https://nodejs.org/api/modules.html'],
  ['net', 'https://nodejs.org/api/net.html'],
  ['os', 'https://nodejs.org/api/os.html'],
  ['path', 'https://nodejs.org/api/path.html'],
  ['perf_hooks', 'https://nodejs.org/api/perf_hooks.html'],
  ['process', 'https://nodejs.org/api/process.html'],
  ['querystring', 'https://nodejs.org/api/querystring.html'],
  ['readline', 'https://nodejs.org/api/readline.html'],
  ['repl', 'https://nodejs.org/api/repl.html'],
  ['stream', 'https://nodejs.org/api/stream.html'],
  ['string_decoder', 'https://nodejs.org/api/string_decoder.html'],
  ['timers', 'https://nodejs.org/api/timers.html'],
  ['tls', 'https://nodejs.org/api/tls.html'],
  ['tracing', 'https://nodejs.org/api/tracing.html'],
  ['tty', 'https://nodejs.org/api/tty.html'],
  ['dgram', 'https://nodejs.org/api/dgram.html'],
  ['url', 'https://nodejs.org/api/url.html'],
  ['util', 'https://nodejs.org/api/util.html'],
  ['vm', 'https://nodejs.org/api/vm.html'],
  ['zlib', 'https://nodejs.org/api/zlib.html'],
  ['event-loop', 'https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/'],
  ['guides', 'https://nodejs.org/en/docs/guides/']
]))

documentationLinks.set('js', new Map([
  ['array', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array'],
  ['map', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map']
]))

module.exports = ({
  message, args: [namespace, docName]
}) => {
  if (is(namespace) !== 'string') {
    return message.reply(`Le nom de la documentation est invalide! Exemple: !doc ${[...documentationLinks.keys()].join('|')}`)
  }
  namespace = namespace.toLowerCase()
  if (!documentationLinks.has(namespace)) {
    return message.reply(`La documentation ${namespace} n'existe pas. Les documentations existantes sont : ${[...documentationLinks.keys()].join(', ')}`)
  }
  if (is(docName) !== 'string') {
    return message.reply(`Liste complète des clés qui sont possible pour la doc ${namespace} : ${[...documentationLinks.get(namespace).keys()].join(', ')}`)
  }
  docName = docName.toLowerCase()
  if (!documentationLinks.get(namespace).has(docName)) {
    return message.reply(`La documentation de ${namespace} ne possède pas de liens pour ${docName}.`)
  }

  return message.channel.send(documentationLinks.get(namespace).get(docName))
}
