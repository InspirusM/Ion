var Discord = require(`discord.js`)

module.exports.run = async (client, message, args) => {

let inviteemb = new Discord.RichEmbed()
.setAuthor(client.user.username)
.setColor("#fffff")
.setTitle("A Bot Build By R4A W RAJAT#4037")
.setURL("https://discordapp.com/api/oauth2/authorize?client_id=479143648668155905&permissions=8&scope=bot")
.addField("Bot Invite","A Music Bot For Your Server")
.addField(`${client.user.username} Invite Link`," [Click Me To Invite](https://discordapp.com/api/oauth2/authorize?client_id=479143648668155905&permissions=8&scope=bot)")
.setFooter("©R4A")
return message.channel.send(inviteemb);

}
exports.conf = {
aliases: [""]
}
exports.help = {
  name: "invite"
}

