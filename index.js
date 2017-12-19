'use strict';
// @ts-check

// Require Node Packages
const event             = require('events');

// Require NPM Packages!
const Discord           = require('discord.js');
const Twit              = require('twit');
const is                = require('@sindresorhus/is');

// Require Internal Dependnecies
const CommandManager    = require('./src/command.js');

// Require Rules
const RULE_Liens        = require('./rules/liens');

// Require JSON configuration.
const config    = require('./config.dev.json');
const varRegex  = /^!([a-z]+)\s*(.*)/;

const TwitterAPI = new Twit(config.twitter);

// Create Command manager!
const CM = new CommandManager();

/* 
 * Get user rôles...
 */
CM.addCommand('role',function({message}) {
    message.mentions.members.array().forEach( GuildMember => {
        if(GuildMember._roles.length > 0) {
            const Roles = GuildMember._roles.map( id => message.guild.roles.get(id).name );
            message.reply(`Les rôle(s) de ${GuildMember.displayName} sont ${Roles.join(', ')}`);
        }
        else {
            message.reply(`${GuildMember.displayName} ne possède aucun rôle!`);
        }
    });
}); 

/*
 * Role(s) exceptions...
 */
const AdministratorRoles = new Set([
    'Administrateur',
    'Moderateur',
    'Bot'
]);

const UserRoles = new Set([
    'Twitter'
]);

const STR_RolesException = [...UserRoles].join(', ');

/*
 * Add user role
 */
CM.addCommand('addrole',function({ message, args: roles }) {
    let [mentionnedUser] = message.mentions.members.array();
    if(is(mentionnedUser) === 'undefined') {
        mentionnedUser = message.member;
    }
    else {
        roles.shift();
    }
    const { id: moderatorRoleID } = message.guild.roles.find('name', 'Moderateur');

    if(message.member.roles.has(moderatorRoleID) === false) {
        if(mentionnedUser.id !== message.member.id) {
            return message.reply('Vous n\'êtes pas autoriser à attribuer des rôles à un autre utilisateur!');
        }
        const goThrough = roles.every( roleName => UserRoles.has(roleName) );
        if(goThrough === false) {
            return message.reply(`Désolé pour utiliser la command **!addrole** il vous faut être modérateur. Sauf pour les rôles ${STR_RolesException}`);
        }
    }

    if(roles.length === 0) {
        return message.reply(`Merci de préciser au moins un rôle. Exemple : **!addrole** @userMention role1 role2 ...`);
    }

    const rolesToAdd = [];
    roles.forEach( roleName => {
        if(AdministratorRoles.has(roleName) === true) return;
        const GuildRole = message.guild.roles.find('name', roleName);
        if(GuildRole == null) return;
        if(mentionnedUser.roles.has(GuildRole.id) === false) 
            rolesToAdd.push(GuildRole);
    });

    if(rolesToAdd.length === 0) {
        return message.reply(`Il semble que le ou les rôle(s) que vous avez mentionné n'existent pas. Il se peut aussi que ${mentionnedUser.displayName} possède déjà les rôle(s) en question.`);
    }
    rolesToAdd.forEach( role => mentionnedUser.addRole(role.id) );
    const ret = roles.join(', ').replace('@','');
    message.reply(`Le ou les rôle(s) suivant : ${ret} ont été ajouté sur ${mentionnedUser.displayName}`);
});

/*
 * Remove role
 */
CM.addCommand('delrole',function({ message, args: roles }) {
    let [mentionnedUser] = message.mentions.members.array();
    if(is(mentionnedUser) === 'undefined') {
        mentionnedUser = message.member;
    }
    else {
        roles.shift();
    }
    const { id: moderatorRoleID } = message.guild.roles.find("name", "Moderateur");

    if(message.member.roles.has(moderatorRoleID) === false) {
        if(mentionnedUser.id !== message.member.id) {
            return message.reply('Vous n\'êtes pas autoriser à attribuer des rôles à un autre utilisateur!');
        }
        const goThrough = roles.every( roleName => UserRoles.has(roleName) );
        if(goThrough === false) {
            return message.reply(`Désolé pour utiliser la command **!delrole** il vous faut être modérateur. Sauf pour les rôles ${STR_RolesException}`);
        }
    }

    if(roles.length === 0) {
        return message.reply(`Merci de préciser au moins un rôle. Exemple : **!delrole** @userMention role1 role2 ...`);
    }

    const rolesToDelete = [];
    roles.forEach( roleName => {
        if(AdministratorRoles.has(roleName) === true) return;
        const GuildRole = message.guild.roles.find("name", roleName);
        if(GuildRole == null) return;
        if(mentionnedUser.roles.has(GuildRole.id) === true) 
            rolesToDelete.push(GuildRole);
    });

    if(rolesToDelete.length === 0) {
        return message.reply(`Il semble que le ou les rôle(s) que vous avez mentionné n'existent pas. Il se peut aussi que ${mentionnedUser.displayName} ne possède pas les rôle(s) en question.`);
    }
    rolesToDelete.forEach( role => mentionnedUser.removeRole(role.id) );
    const ret = roles.join(', ').replace('@','');
    message.reply(`Le ou les rôle(s) suivant : ${ret} ont été supprimé sur ${mentionnedUser.displayName}`);
});

const DocumentationLinks = new Map();
DocumentationLinks.set('node', new Map([
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
]));

DocumentationLinks.set('js', new Map([
    ['array', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Array'],
    ['map', 'https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Map']
]));

/*
 * DOC Feature
 */
CM.addCommand('doc',function({message, args: [namespace, docName]}) {
    if(is(namespace) !== 'string') {
        return message.reply(`Le nom de la documentation est invalide! Exemple: !doc ${[...DocumentationLinks.keys()].join('|')}`);
    }
    namespace = namespace.toLowerCase();
    if(!DocumentationLinks.has(namespace)) {
        return message.reply(`La documentation ${namespace} n'existe pas. Les documentations existantes sont : ${[...DocumentationLinks.keys()].join(', ')}`);
    }
    if(is(docName) !== 'string') {
        return message.reply(`Liste complète des clés qui sont possible pour la doc ${namespace} : ${[...DocumentationLinks.get(namespace).keys()].join(', ')}`);
    }
    docName = docName.toLowerCase();
    if(!DocumentationLinks.get(namespace).has(docName)) {
        return message.reply(`La documentation de ${namespace} ne possède pas de liens pour ${docName}.`);
    }
    return message.channel.send(DocumentationLinks.get(namespace).get(docName));
});

// Initialize tweeter feed on a specific channel !
let feedChannel;
CM.addCommand('feedtweeter',function({message}) {
    const { id } = message.guild.roles.find("name", "Moderateur");
    message.delete();
    if(message.member.roles.has(id) === false) {
        return message.reply(`Cet commande est réservé aux Modérateurs de la communauté !`);
    }
    feedChannel = message.channel;
    feedChannel.send('Streaming de la timeline twitter initialisé avec succès!');
});

/*
 * Help command
 */
CM.addCommand('help',function({message}) {
    const commands = [...CM.getRegisteredCommands()];
    message.channel.send(`All commands available are:\n!${commands.join('\n!')}`);
});

// Apply channel rules...
const ChannelRules = new event(); 
ChannelRules.on(RULE_Liens.channelName, RULE_Liens.handler);

/*
 *  message handler!
 */
function messageHandler(message) {
    const { channel: {name: channelName}, content, member } = message;
    if(content[0] === config.command_char) {
        try {
            const [,cmd,argStr] = varRegex.exec(content);
            return CM.handle(message, cmd, argStr.split(" ").filter( v => v !== '' ) );
        }
        catch(E) {
            return console.error(E);
        }
    }
    // if (member.user.bot === false) {
    //     ChannelRules.emit(channelName, message);
    // }
}

/*
 * Create Discord bot!
 */
const ESBot = new Discord.Client();

// Twitter Account restrictions...
const TwitterNames = new Set(config.twitter_users);

ESBot.on('ready', () => {
    console.log('ES Community bot ready!!');
    const stream = TwitterAPI.stream('statuses/filter', { track: config.twitter_feeds });

    stream.on('tweet', function (tweet) {
        //console.log(tweet);
        const { id_str , retweeted_status, user: { screen_name }, in_reply_to_screen_name, is_quote_status } = tweet;
        if (!TwitterNames.has(screen_name)) return;
        if (in_reply_to_screen_name != null || is(retweeted_status) !== 'undefined' || is_quote_status === true) return;
        if (is(feedChannel) !== 'undefined') {
            feedChannel.send(`https://twitter.com/${screen_name}/status/${id_str}`);
        }
    });
    process.on('SIGINT', () => {
        stream.stop();
    });
});

ESBot.on('guildMemberAdd', member => {
    member.sendMessage('Bienvenue à toi ! Pense à te présenter dans le salon #presentation pour pouvoir devenir un membre officiel de la communauté ECMAScript !');
});

ESBot.on('message', messageHandler);
ESBot.on('messageUpdate', messageHandler);
ESBot.login(config.discord.token);

process.on('SIGINT', () => {
    ESBot.destroy();
});
console.log('ES Community node server started!');