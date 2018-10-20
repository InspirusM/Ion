var Discord = require(`discord.js`);
var db = require(`quick.db`);
var send = require(`quick.hook`)

module.exports.run = (client, message, args, prefix) => {
  let perm = new Discord.RichEmbed()
  .setDescription(`To Use This Command You Must Have Manage Server Permission`)
  if(!message.member.hasPermission("MANAGE_GUILD")) {
  return message.channel.send(perm);
  }

     if(`${args[0]}` == `set`){
            // Setting Channel
             if(`${args[1]}` == `channel`) {
                try {
                    // Embed
                     let mentionEmbed = new Discord.RichEmbed()
                     .setDescription(`**Please mention a channel**\n **>** *${prefix}cfg set channel #channel*`)
                    // Return Statements
                     if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send(perm, 120000) // This returns if it CANT find the admin perm on them. It then uses the function to send to message.channel, and deletes the message after 120000 milliseconds (2minutes)
                     if (!args.slice(2, 1000, args[2]).join(' ') === 'NONE') return message.channel.send(mentionEmbed) // This returns if they don't message a channel, but we also want it to continue running if they want to disable the log
                
                
                     let newChannel = ''
              
                     const errorReport = client.channels.get(`503036476481601536`)
                     if (args.slice(2, 1000, args[2]).join(' ') === 'NONE')
                     if(`${message.mentions.channels.first()}` == `undefined`) return
                     let channelEmbed = new Discord.RichEmbed()
                     .setDescription(`**Successfully updated welcoming channel to ${message.mentions.channels.first()}**`)
                
                    // Update Channel
                     db.set(`pmessageChannel_${message.guild.id}`, `${message.mentions.channels.first().id}`).then(i => {
                        message.channel.send(channelEmbed) // Finally, send in chat that they updated the channel.
                     })
                }catch(err) {console.log(`Error with setting channel\n${err}`)}
             }}
};
exports.conf = {
aliases: [""]
}
module.exports.help = {
name: "cfg"
}