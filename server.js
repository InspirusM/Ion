const Discord = require('discord.js')
const YouTube = require('simple-youtube-api');
const ytdl = require('ytdl-core');
const youtube = new YouTube(process.env.YOUTUBE_API_KEY);
const queue = new Map();
const client = new Discord.Client();
const fs = require("fs")
var servers = {};
var db = require('quick.db');
var prefix = "%";
var send = require(`quick.hook`);
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir('./commands/', (err, files) => {
	if (err)
		console.error(err);
	let jsfiles = files.filter(f => f.split('.')
		.pop() === 'js');
	if (jsfiles.length <= 0) {
		console.log('No commands to load!');
		return;
	}
	console.log(`[Commands]\tLoaded a total amount ${files.length} Commands`);
	jsfiles.forEach(f => {
		let props = require(`./commands/${f}`);
    console.log(`${f} Is Loded`)
		props.fileName = f;
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});

client.on('error', console.error);

client.on('disconnect', () => console.log('I just disconnected, making sure you know, I will reconnect now...'));

client.on('reconnecting', () => console.log('I am reconnecting now!'));

client.on("ready", async () => {
  console.log(`${client.user.username} is online on ${client.guilds.size} servers!`);
  client.user.setActivity(`%help | ${client.guilds.size} Guilds`, {type: "LISTENING"});
});
client.on("guildCreate", guild => {
  let welcomechannel = guild.channels.find(c => c.name == "welcome");
  let bicon = client.user.displayAvatarURL;
  let support = new Discord.RichEmbed()
.setAuthor(client.user.username)
.setThumbnail(bicon)
.setColor("RANDOM")
.setTitle(`Thanks\'s For Inviting Me If You Find Any Bug Report It By ${prefix}bug [yourbug]`)
.addField(`Hello I Am Lithium Ion`,"A Bot Developed By R4A W RAJAT#4037")
.addField(`My Prefix Is ${prefix}`,`And Help Command ${prefix}help`)
.setTimestamp()
  
  welcomechannel.send(support);
}); 
client.on("guildCreate", guild => {
    const join = client.channels.get("503030590426316810"); //CHANGE TO YOUR CHANNEL-ID TO GET NOTIFICATIONS
    let rbnEmbed = new Discord.RichEmbed()
    .setTitle(`Started Servering In **${guild.name}**`)
    .setColor(`GREEN`)
    .setDescription(`**Guild Owner**: ${guild.owner}\n**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Guild Channels Count**: ${guild.channels.size} \n**Members Gained**: ${guild.memberCount}`)
    send(join , rbnEmbed, {
        name: `Lithium Monitor`
    })// give me access to eval pls
    
});
client.on("guildDelete", guild => {
    const rbnleave = client.channels.get("503030590426316810"); //CHANGE TO YOUR CHANNEL-ID TO GET NOTIFICATIONS
    let rbnembed = new Discord.RichEmbed()
    //.setAuthor(client.user.username, client.user.avatarURL)
    .setThumbnail(guild.iconURL)
    .setColor(`RED`)
    .setTitle(`Stopped Serving In **${guild.name}**`)
    .setDescription(`**Guild Owner**: ${guild.owner}\n**Guild Name**: ${guild.name}\n**Guild ID**: ${guild.id}\n**Guild Channels Count**: ${guild.channels.size} \n**Members Lost**: ${guild.memberCount}`)
    send(rbnleave, rbnembed, {
        name: `Bot leaving`
    })
  });
client.on('guildMemberAdd', async member => {
    let autoRole = await db.fetch(`autorole_${member.guild.id}`).catch(err => console.log(err));
    let autorole = member.guild.roles.find(r => r.name === autoRole);
  if(!autorole) return;
    let bot = member.guild.roles.find(r => r.name === 'Bots')
    member.addRole(autorole);
      if (member.user.bot) await member.removeRole(autorole.id).then(m => member.addRole(bot.id));
});
    client.on('guildMemberAdd', async member => { // If User Joins A Guild
        let channelspam = await db.fetch(`pmessageChannel_${member.guild.id}`) // Fetch Welcome/Leaving Channel
        if (!channelspam) return; // If Welcome/Leaving Channel Is Existent

        if (!member.guild.channels.get(channelspam)) return // If Channel Welcome/Leave Exists Within Guild As A Channel
        let channeled = member.guild.channels.get(channelspam) // Grabs Channel ID Enabling Input Of Server

        var joinEmbed = new Discord.RichEmbed()
        .setColor('00FF00')
        .setAuthor(member.user.tag + ' has joined server')
      .setThumbnail(member.user.displayAvatarURL)
      .setDescription(`Now Server Has ${member.guild.memberCount} Members`)     
      .setFooter(`User Joined At`)
      .setTimestamp()
        return channeled.send(joinEmbed).catch((err) => console.log(err))
    });
client.on("message", async message => {
  
 if(message.author.bot) return;
  if(message.channel.type === "dm") return;
  
       var args2 = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
   var searchString = args2.slice(1).join(' ');
	var url = args2[1] ? args2[1].replace(/<(.+)>/g, '$1') : '';
	var serverQueue = queue.get(message.guild.id);
    switch (args2[0].toLowerCase()) {
      case "play":
    var voiceChannel = message.member.voiceChannel;
		if (!voiceChannel) return message.channel.send('You need to be in voice channel first!');
		var permissions = voiceChannel.permissionsFor(message.client.user);
		if (!permissions.has('CONNECT')) {
      const errorconnect = new Discord.RichEmbed()
      .setColor(`RED`)
      .setFooter(`This message will be deleted in 10 seconds..`)
      .setDescription(`I couldn't connect into your voice channel, Missing **CONNECT** Permission.`)
			return message.channel.send(errorconnect).then(message => {
        message.delete(10000)
      })
		}
		if (!permissions.has('SPEAK')) {
      const errorspeak = new Discord.RichEmbed()
      .setColor(`RED`)
      .setFooter(`This message will be deleted in 10 seconds..`)
      .setDescription(`I couldn't speak at your voice channel, Missing **SPEAK** Permission.`)
			return message.channel.send(errorspeak).then(message => {
        message.delete(10000)
      })
		}
      if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
			var playlist = await youtube.getPlaylist(url);
			var videos = await playlist.getVideos();
			for (const video of Object.values(videos)) {
				var video2 = await youtube.getVideoByID(video.id);
				await handleVideo(video2, message, voiceChannel, true);
			}
        const playlistembed = new Discord.RichEmbed()
        .setColor(`GREEN`)
        .setDescription(`✅ ${playlist.title} has been added to the queue!`)
			return message.channel.send(playlistembed);
		} else {
			try {
				var video = await youtube.getVideo(url);
			} catch (error) {
				try {
					var videos = await youtube.searchVideos(searchString, 9);
					var index = 0;
          let selectionemb = new Discord.RichEmbed()
          .setTitle(`🎶 Song selection`)
          .setDescription(`${videos.map(video2 => `**${++index} -** [${video2.title}](${video2.url})`).join('\n')}`)
          .setFooter('🔎 Please provide a number to select one of the search results ranging from 1-9.')
          .setColor('#0fe709')
					message.channel.send(selectionemb).then(message => {
            message.delete(11000)
          })
					// eslint-disable-next-line max-depth
					try {
						var response = await message.channel.awaitMessages(message2 => message2.content > 0 && message2.content < 10, {
							maxMatches: 1,
							time: 10000,
							errors: ['time']
						});
					} catch (err) {
						console.error(err);
            let noinvemb = new Discord.RichEmbed()
            .setDescription('No or invalid value entered, cancelling video selection.')
            .setColor('#e41016')
						return message.channel.send(noinvemb).then(message => {
              message.delete(5000)
            })
					}
					var videoIndex = parseInt(response.first().content);
					var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
				} catch (err) {
					console.error(err);
					return message.channel.send('Can\'t find the video');
				}
			}
			return handleVideo(video, message, voiceChannel);
		}
        break;
      case "skip":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
		serverQueue.connection.dispatcher.end('Skip command has been used!');
        message.channel.send(':stop_button: Skipped!')
		return undefined;
        break;
      case "stop":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel!');
		if (!serverQueue) return message.channel.send('There is nothing playing right now');
		serverQueue.songs = [];
		serverQueue.connection.dispatcher.end('Stop command has been used!');
        message.channel.send(':stop_button: Stopped!')
		return undefined;
break;
      case "volume":
		if (!message.member.voiceChannel) return message.channel.send('You are not in a voice channel.');
    if (message.member.voiceChannel !== message.guild.me.voiceChannel) return message.channel.send('You are not in a same voice channel.');
		if (!serverQueue) return message.channel.send('There is nothing playing.');
        let currentvolumeemb = new Discord.RichEmbed()
        .setDescription(`The current volume is: **${serverQueue.volume}**`)
        .setColor('#27ce12')
		if (!args2[1]) return message.channel.send(currentvolumeemb);
    if (args2[1] > 100) return message.channel.send("Volume Limt Is 100");
		serverQueue.volume = args2[1];
		serverQueue.connection.dispatcher.setVolumeLogarithmic(args2[1] / 20);
        let setvolumeemb = new Discord.RichEmbed()
        .setDescription(`I set the volume to: **${args2[1]}**`)
        .setColor('#27ce12')
		return message.channel.send(setvolumeemb);
break;
      case "np":
		if (!serverQueue) return message.channel.send('There is nothing playing.');
        let nowplayingemb = new Discord.RichEmbed()
        .setDescription(`🎶 Now playing: **${serverQueue.songs[0].title}**`)
        .setColor(`GREEN`)
		return message.channel.send(nowplayingemb);
break;
      case "queue":
		if (!serverQueue) return message.channel.send('No music playing right now.');
        let queueemb = new Discord.RichEmbed()
        .setAuthor(`${message.guild.name} Queue list `)
        .setDescription(`${serverQueue.songs.map(song => `**•** [${song.title}](https://www.youtube.com/watch?v=${song.id}})`).join('\n')}\n\n🎶 **Now playing:** ${serverQueue.songs[0].title}`)
        .setColor(`GREEN`)
		return message.channel.send(queueemb)
break;
      case "pause":
		if (serverQueue && serverQueue.playing) {
			serverQueue.playing = false;
			serverQueue.connection.dispatcher.pause();
			return message.channel.send('⏸ Music paused');
		}
		return message.channel.send('There is nothing playing.');
break;
      case "resume":
		if (serverQueue && !serverQueue.playing) {
			serverQueue.playing = true;
			serverQueue.connection.dispatcher.resume();
			return message.channel.send('▶ Music resumed');
		}
		return message.channel.send('There is nothing playing.');
	
	return undefined;
break;
}
async function handleVideo(video, message, voiceChannel, playlist = false) {
	var serverQueue = queue.get(message.guild.id);
	console.log(video);
	var song = {
		id: video.id,
		title: video.title,
		url: `https://www.youtube.com/watch?v=${video.id}`,
    channel: video.channel.title,
    durationm: video.duration.minutes,        
    durations: video.duration.seconds,
    durationh: video.duration.hours,
    publishedAt: video.publishedAt,
	};
	if (!serverQueue) {
		var queueConstruct = {
			textChannel: message.channel,
			voiceChannel: voiceChannel,
			connection: null,
			songs: [],
			volume: 5,
			playing: true
		};
		queue.set(message.guild.id, queueConstruct);

		queueConstruct.songs.push(song);

		try {
			var connection = await voiceChannel.join();
			queueConstruct.connection = connection;
			play(message.guild, queueConstruct.songs[0]);
		} catch (error) {
      let vcerr = client.channels.get('502121619779485727')
			vcerr.send(`I could not join the voice channel: ${error}`);
			queue.delete(message.guild.id);
			return message.channel.send(`I could not join the voice channel: ${error}`);
		}
	} else {
    //let queuelog = client.channels.get('502121071789604865')
		serverQueue.songs.push(song);
		console.log(serverQueue.songs);
		if (playlist) return undefined;
    let queueemb = new Discord.RichEmbed()
    .setAuthor(`Added to ${message.guild.name} Queue list`, message.author.displayAvatarURL)
    .setColor(`#1ace18`)
    .addField(`Publisher:`, `${song.channel}`, true)
    .addField(`Video ID:`, song.id, true)
    .setFooter(`Video Published At ${song.publishedAt}`)
    .addField(`Duration:`, `**${song.durationh}** hours, **${song.durationm}** minutes, **${song.durations}** seconds`, true)
    .setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
    .setColor(`GREEN`)
  //  queuelog.send(queueemb)
		return message.channel.send(queueemb).then(msg => {
      message.delete(10000)
    })
	}
	return undefined;
}
  function play(guild, song) {
	var serverQueue = queue.get(guild.id);

	if (!song) {
		serverQueue.voiceChannel.leave();
		queue.delete(guild.id);
		return;
	}
	console.log(serverQueue.songs);

	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
		.on('end', reason => {
			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');
			else console.log(reason);
			serverQueue.songs.shift();
			play(guild, serverQueue.songs[0]);
		})
		.on('error', error => console.error(error));
	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);

    
    let playingemb = new Discord.RichEmbed()
    .setAuthor(`🎶 Now playing`, message.author.displayAvatarURL)
    .setColor(`SKY BLUE`)
    .addField(`Publisher:`, `${song.channel}`, true)
    .addField(`Video ID:`, song.id, true)
    .setFooter(`Video Published At ${song.publishedAt}`)
    .addField(`Duration:`, `**${song.durationh}** hours, **${song.durationm}** minutes, **${song.durations}** seconds`, true)
    .addField(`Users who executing this commands:`, message.author.tag)
    .setThumbnail(`https://i.ytimg.com/vi/${song.id}/sddefault.jpg`)
    .setDescription(`[${song.title}](https://www.youtube.com/watch?v=${song.id}})`)
    .setTimestamp()

	serverQueue.textChannel.send(playingemb);
}

    
  if(message.content === `${prefix}help`) {

  let bicon = client.user.displayAvatarURL;
  let support = new Discord.RichEmbed()
.setAuthor(client.user.username)
.setThumbnail(bicon)
.setColor("RANDOM")
.setTitle("My Commands")
.setDescription(`For More Commands Type ${prefix}uhelp `)
.addField(`${prefix}play`,"To Play Music")
.addField(`${prefix}skip`,"To Skip Music")
.addField(`${prefix}np`,"To See Now Playing Music")
.addField(`${prefix}pause`,"To Pause A Playing Track")
.addField(`${prefix}resume`,"To Resume A Playing Track")
.addField(`${prefix}voulume`,"To Increase Or Decrease The Volume")
.addField(`${prefix}server`,"Give Link Of Support Server")
.addField(`${prefix}invite`,"Give Link Of Bot")
.setTimestamp()

message.channel.send(support);
  }

    let fetchedPrefix = await db.fetch(`serverPrefix_${message.guild.id}`);
    if (fetchedPrefix === null) fetchedPrefix = prefix;
    else prefix = fetchedPrefix;
  
  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);
  let msg = message;
  if (message == `<@${client.user.id}>`) return message.channel.send(`Hye ${message.author}, my prefix is \`${prefix}\``);
  if(cmd.startsWith(prefix)){
    
  let commandfile = client.commands.get(cmd.slice(prefix.length));
  if(commandfile) commandfile.run(client,message,args,prefix);
    
  }
});
client.login(process.env._TOKEN);


//NDc5MTQzNjQ4NjY4MTU1OTA1.DqjNFw.ty9jZc578WEEdg6XrLOjuRiQoNI
//NDc5MTQzNjQ4NjY4MTU1OTA1.DqjNFw.ty9jZc578WEEdg6XrLOjuRiQoNI token

