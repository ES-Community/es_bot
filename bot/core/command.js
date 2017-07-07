const event = require('events');

class CommandManager extends event {

    constructor() {
        super();
        this.commandsRegistry = new Map();
    }

    addCommand(name,callback) {
        const fullCMDName = `command_${name}`;
        this.commandsRegistry.set(name,fullCMDName);
        this.on(fullCMDName,callback);
    }

    getRegisteredCommands() {
        return this.commandsRegistry.keys();
    }

    handle(message,commandName,args) {
        this.emit(`command_${commandName}`,{message,args});
    }

}

module.exports = CommandManager;