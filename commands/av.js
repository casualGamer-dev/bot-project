module.exports = {
    name:' av',
    description:'this shows the avatar of the user ',
    cooldown: 5,
    execute(message,args){
        message.reply(message.author.displayAvatarURL());
    }
    
    }