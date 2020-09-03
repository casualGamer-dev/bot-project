const pagination = require('discord.js-pagination');
const Discord = require('discord.js');

module.exports = {
    name: "help",
    description: "The help command, what do you expect?",

    async run (client, message, args){

        //Sort your commands into categories, and make seperate embeds for each category

        const moderation = new Discord.MessageEmbed()
        .setTitle('Moderation')
        .addField('`kick`', 'Kicks a member from your server via mention or ID')
        .addField('`ban`', 'Bans a member from your server via mention or ID')
        .addField('`clear`', 'Purges messages')
        .addField('`awarn`', 'warns')
        .addField('`warnings`', 'shows the warning')
        .addField('`deletewarns`', 'deletes warns')
        .setTimestamp()

        const fun = new Discord.MessageEmbed()
        .setTitle('Fun')
        .addField('`meme`', 'Generates a random meme')
        .addField('`ascii`', 'Converts text into ascii')
        .addField('`inventory`', 'shows inventory')
        .addField('`leaderboard`', 'levels duh')
        .addField('`setprefix`', 'self explanatory')
        .addField('`giveaway`', 'giveaway')
        .addField('`member`', 'memberlist')
        .addField('`say`', 'says')
        .setTimestamp()

        const utility = new Discord.MessageEmbed()
        .setTitle('Utlity')
        .addField('`calculate`', )
        .addField('`ping`', 'Get the bot\'s API ping')
        .addField('`weather`', 'Checks weather forecast for provided location')
        .addField('`covid`', 'covid')
        .setTimestamp()

        const pages = [
                moderation,
                fun,
                utility
        ]

        const emojiList = ["⏪", "⏩"];

        const timeout = '120000';

        pagination(message, pages, emojiList, timeout)
    }
}