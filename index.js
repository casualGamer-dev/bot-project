const Discord = require('discord.js');
const { Client, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const client = new Discord.Client();
const cooldowns = new Discord.Collection();
const prefix = '-';
require('dotenv').config();
const guildInvites = new Map();
const fetch = require('node-fetch');
const querystring = require('querystring');
const LIMIT = 5;
const TIME = 7000;
const DIFF = 3000;
const usersMap = new Map();
const trim = (str, max) => ((str.length > max) ? `${str.slice(0, max - 3)}...` : str)
;
;

const { token, default_prefix } = require('./config.json');

const { readdirSync } = require('fs');

const { join } = require('path');

client.config = config;

const leveling = require('discord-leveling');
const db = require('quick.db');

const fs= require('fs');

client.commands = new Discord.Collection();




client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', async message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'cat') {
		const { file } = await fetch('https://aws.random.cat/meow').then(response => response.json());

		message.channel.send(file);
	} else if (command === 'urban') {
		if (!args.length) {
			return message.channel.send('You need to supply a search term!');
		}

		const query = querystring.stringify({ term: args.join(' ') });

		const { list } = await fetch(`https://api.urbandictionary.com/v0/define?${query}`).then(response => response.json());

		if (!list.length) {
			return message.channel.send(`No results found for **${args.join(' ')}**.`);
		}

		const [answer] = list;

		const embed = new Discord.MessageEmbed()
			.setColor('#EFFF00')
			.setTitle(answer.word)
			.setURL(answer.permalink)
			.addFields(
				{ name: 'Definition', value: trim(answer.definition, 1024) },
				{ name: 'Example', value: trim(answer.example, 1024) },
				{ name: 'Rating', value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.` },
			);
		message.channel.send(embed);
	}
});



const { GiveawaysManager } = require('discord-giveaways');

client.giveawaysManager = new GiveawaysManager(client, {
    storage: "./giveaways.json",
    updateCountdownEvery: 5000,
    default: {
        botsCanWin: false,
        exemptPermissions: [],
        embedColor: "#FF0000",
        reaction: "🎉"
    }
});

client.commands= new Discord.Collection();
//You can change the prefix if you like. It doesn't have to be ! or ;
const commandFiles = readdirSync(join(__dirname, "commands")).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
    const command = require(join(__dirname, "commands", `${file}`));
    client.commands.set(command.name, command);
}


client.on("error", console.error);

client.on('ready', () => {
    console.log('I am ready');
    client.user.setActivity(`Playing -help in 8 serverss`)
});


let stats = {
    serverID: '<ID>',
    total: "<ID>",
    member: "<ID>",
    bots: "<ID>"
}



client.on('guildMemberAdd', member => {
    if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);
})

client.on('guildMemberRemove', member => {
    if(member.guild.id !== stats.serverID) return;
    client.channels.cache.get(stats.total).setName(`Total Users: ${member.guild.memberCount}`);
    client.channels.cache.get(stats.member).setName(`Members: ${member.guild.members.cache.filter(m => !m.user.bot).size}`);
    client.channels.cache.get(stats.bots).setName(`Bots: ${member.guild.members.cache.filter(m => m.user.bot).size}`);

    
})

client.on("message", async message => {

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;

    let prefix = await db.get(`prefix_${message.guild.id}`);
    if(prefix === null) prefix = default_prefix;

    let profile = await leveling.Fetch(message.author.id);
    leveling.AddXp(message.author.id, 15);

    if(profile.xp + 15 > 150){
        leveling.AddLevel(message.author.id, 1);
        leveling.SetXp(message.author.id, 0)
        message.channel.send(`Congratulations ${message.author.username}, you just advanced to level ${profile.level + 1}`)
    }

    if(message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);

        const command = args.shift().toLowerCase();

        if(!client.commands.has(command)) return;


        try {
            client.commands.get(command).run(client, message, args);

        } catch (error){
            console.error(error);
        }
    }
})





     
    

  client.on('guildMemberAdd', member => {
    
    const channel = member.guild.channels.cache.find(ch => ch.name === 'welcome');
    
    if (!channel) return;

    channel.send(`Welcome to the server Please read to rules in #rules, ${member}`);
  });

  client.on('inviteCreate', async invite => guildInvites.set(invite.guild.id, await invite.guild.fetchInvites()));
  client.on('ready', () => {
      console.log(`${client.user.tag} has logged in.`);
      client.guilds.cache.forEach(guild => {
          guild.fetchInvites()
              .then(invites => guildInvites.set(guild.id, invites))
              .catch(err => console.log(err));
      });
  });
  
  client.on('guildMemberAdd', async member => {
      const cachedInvites = guildInvites.get(member.guild.id);
      const newInvites = await member.guild.fetchInvites();
      guildInvites.set(member.guild.id, newInvites);
      try {
          const usedInvite = newInvites.find(inv => cachedInvites.get(inv.code).uses < inv.uses);
          const invite = new MessageEmbed()
              .setDescription(`${member.user.tag} is the ${member.guild.memberCount} to join.\nJoined using ${usedInvite.inviter.tag}\nNumber of uses: ${usedInvite.uses}`)
              .setTimestamp()
              .setTitle(`${usedInvite.url}`);
         
          if(!Channel) {
              Channel.send(invite).catch(err => console.log(err));
          }
      }
      catch(err) {
          console.log(err);
      }
  }); 
  

client.on('message', message => {
	if(message.author.bot) return;
	if(usersMap.has(message.author.id)) {
	  const userData = usersMap.get(message.author.id);
	  const { lastMessage, timer } = userData;
	  const difference = message.createdTimestamp - lastMessage.createdTimestamp;
	  let msgCount = userData.msgCount;
	  console.log(difference);
	  if(difference > DIFF) {
		clearTimeout(timer);
		console.log('Cleared timeout');
		userData.msgCount = 1;
		userData.lastMessage = message;
		userData.timer = setTimeout(() => {
		  usersMap.delete(message.author.id);
		  console.log('Removed from RESET.');
		}, TIME);
		usersMap.set(message.author.id, userData);
	  }
	  else {
		++msgCount;
		if(parseInt(msgCount) === LIMIT) {
		  const role = message.guild.roles.cache.get('');
		  message.member.roles.add(739467254558621728);
		  message.channel.send('You have been muted.');
		  setTimeout(() => {
			message.member.roles.remove(role);
			message.channel.send('You have been unmuted');
		  }, TIME);
		} else {
		  userData.msgCount = msgCount;
		  usersMap.set(message.author.id, userData);
		}
	  }
	}
	else {
	  let fn = setTimeout(() => {
		usersMap.delete(message.author.id);
		console.log('Removed from map.');
	  }, TIME);
	  usersMap.set(message.author.id, {
		msgCount: 1,
		lastMessage: message,
		timer: fn
	  });
	}
  });
client.on('guildMemberAdd', member => {
  console.log('User' + member.user.tag + 'has joined the server!');
  var role = message.guild.roles.cache.find(role => role.name === "Member")
  if(role === "member"){
  member.addRole("role" );
}
else{
console.log("no role found")
}
})





client.login(config.token);


