// Require Packages!
const Discord           = require('discord.js');
const event             = require('events');
const CommandManager    = require('./core/command.js');

// Require JSON configuration.
const config    = require('./configuration.json');
const varRegex  = /^!([a-z]+)\s*(.*)/;

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
    message.reply(`Le ou les rôle(s) suivant : ${rolesToAdd.join(', ')} ont été ajouté sur ${mentionnedUser.displayName}`);
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
    message.reply(`Le ou les rôle(s) suivant : ${rolesToDelete.join(', ')} ont été supprimé sur ${mentionnedUser.displayName}`);
});

/*
 * Check global success or specific user(s) success!
 */
CM.addCommand('success',function({message}) {
    const mentions = message.mentions.members.array();
    if(mentions.length > 0) {

    }
    else {

    }
});

/*
 * Help command
 */
CM.addCommand('help',function({message}) {
    const commands = CM.getRegisteredCommands();
    message.reply(`All commands available are:\n\t${commands.join('\n\t')}`);
});

/*
 * Channels rules!
 */
const ChannelRules = new event(); 

const linkMessageFormat = /^\*\*\[\s.*\s\]\*\*\s.*/;
ChannelRules.on('links', (message) => {
    if(message.content.match(linkMessageFormat) === true) return;

    message.reply('Le format de votre message est invalide (Merci de le corriger). Exemple => **[ titre ]** Description')
    .then( (warnMessage) => {
        warnMessage.delete(20000);
    });
});

/*
 *  message handler!
 */
function messageHandler(message) {
    const { channel: {name: channelName}, content } = message;

    if(content[0] === config.command_char) {
        try {
            var [,cmd,argStr] = varRegex.exec(content);
        }
        catch(E) {
            console.log(E);
            return;
        }
        console.log(cmd,argStr);
        const argumentsArray = argStr.split(" ");
        CM.handle(message,cmd,argumentsArray);
        return;
    }

    console.log(channelName);
    console.log(content);

    // Apply channel rule!
    //ChannelRules.emit(channelName,message);
}

/*
 * Create Discord bot!
 */
const ESBot = new Discord.Client();

ESBot.on('ready', () => {
    console.log('ES Community bot ready!!');
});

ESBot.on('guildMemberAdd', member => {
    member.sendMessage('Bienvenue à toi ! Pense à te présenter dans le salon #presentation pour pouvoir devenir un membre officiel de la communauté ECMAScript !');
});

ESBot.on('message', messageHandler);
ESBot.on('messageUpdate', messageHandler);
ESBot.login(config.token);

process.on('SIGINT', () => {
    ESBot.destroy();
});
console.log('ES Community node server started!');