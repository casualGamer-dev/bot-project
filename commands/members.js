module.exports = {
    name:' member',
    description:'this is a members command',
    cooldown: 5,
    execute(message,args){
        message.channel.send(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
    }
    
    }