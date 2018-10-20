const Discord = require('discord.js')

exports.run = async(client, message, args, prefix) => {

let dh = new Discord.RichEmbed()

.setTitle('Utility Commands')

.addField(`${prefix}stats`,'Show Bot Stats')
.addField(`${prefix}serverinfo`,'Shows Info About Server')
.addField(`${prefix}autorole`,`Set Autorole usage:${prefix}autorole [rolename] `)
.addField(`${prefix}prefix`,`Change the prefix of bot usage:${prefix}prefix [newprefix]`)
.addField(`${prefix}daily`,`Gives You The Daily Credits`)
.addField(`${prefix}balance`,`Shows Your Total Balance Earned By Daily command`)
.addField(`${prefix}invites`,`Shows Your Total Invites`)
.addField(`${prefix}avatar`,`Shows Your Pretty Avatar`)
.addField(`${prefix}bug`,`If You Find Any Bug In Bot Then Use ${prefix}bug [yourbug]`)
.setFooter(`Requested By ${message.author.username}`);

message.channel.send(dh);
}
exports.conf = {
aliases: [""]
}
exports.help = {
  name: "uhelp"
}
