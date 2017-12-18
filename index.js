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
    'Otaku'
]);

const STR_RolesException = [...UserRoles].join(', ');

/*
 * Add user role
 */
CM.addCommand('addrole',function({message,args}) {
    const [,...roles] = args;
    const mentionnedUser = message.mentions.members.array()[0];
    const { id: moderatorRoleID } = message.guild.roles.find('name', 'Moderateur');

    if(message.member.roles.has(moderatorRoleID) === false) {
        const goThrough = roles.every( roleName => UserRoles.has(roleName) );
        if(goThrough === false) {
            message.reply(`Désolé pour utiliser la command **!addrole** il vous faut être modérateur. Sauf pour les rôles ${STR_RolesException}`);
            return;
        }
    }

    if(roles.length === 0) {
        message.reply(`Merci de préciser au moins un rôle. Exemple : **!addrole** @userMention role1 role2 ...`);
        return;
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
        message.reply(`Il semble que le ou les rôle(s) que vous avez mentionné n'existent pas. Il se peut aussi que ${mentionnedUser.displayName} possède déjà les rôle(s) en question.`);
        return;
    }
    rolesToAdd.forEach( role => mentionnedUser.addRole(role.id) );
    const ret = roles.join(', ').replace('@','');
    message.reply(`Le ou les rôle(s) suivant : ${ret} ont été ajouté sur ${mentionnedUser.displayName}`);
});

/*
 * Remove role
 */
CM.addCommand('delrole',function({message,args}) {
    const [,...roles] = args;
    const mentionnedUser = message.mentions.members.array()[0];
    const { id: moderatorRoleID } = message.guild.roles.find("name", "Moderateur");

    if(message.member.roles.has(moderatorRoleID) === false) {
        const goThrough = roles.every( roleName => UserRoles.has(roleName) );
        if(goThrough === false) {
            message.reply(`Désolé pour utiliser la command **!delrole** il vous faut être modérateur. Sauf pour les rôles ${STR_RolesException}`);
            return;
        }
    }

    if(roles.length === 0) {
        message.reply(`Merci de préciser au moins un rôle. Exemple : **!delrole** @userMention role1 role2 ...`);
        return;
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
        message.reply(`Il semble que le ou les rôle(s) que vous avez mentionné n'existent pas. Il se peut aussi que ${mentionnedUser.displayName} ne possède pas les rôle(s) en question.`);
        return;
    }
    rolesToDelete.forEach( role => mentionnedUser.removeRole(role.id) );
    const ret = roles.join(', ').replace('@','');
    message.reply(`Le ou les rôle(s) suivant : ${ret} ont été supprimé sur ${mentionnedUser.displayName}`);
});

/*
 * Check global success or specific user(s) success!
 */
// CM.addCommand('success',function({message}) {
//     const mentions = message.mentions.members.array();
//     // if(mentions.length > 0) {

//     // }
//     // else {

//     // }
// });

let feedChannel;

// Initialize tweeter feed on a specific channel !
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
    message.reply(`All commands available are:\n\t${commands.join('\n')}`);
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
            var [,cmd,argStr] = varRegex.exec(content);
            // console.log(`cmd > ${cmd}, args: ${argStr}`);
            return CM.handle(message, cmd, argStr.split(" "));
        }
        catch(E) {
            return console.error(E);
        }
    }

    // console.log(channelName);
    // console.log(content);
    // if (member.user.bot === false) {
    //     ChannelRules.emit(channelName,message);
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
        if (feedChannel) {
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