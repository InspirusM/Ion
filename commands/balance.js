const db = require('quick.db')
const Discord = require('discord.js')

module.exports.run = async (bot, message, args) => {
      var user = message.mentions.users.first() || message.author;
      if(user.bot) return message.channel.send('This Command Doesn\'t Works On Bot').then(m => m.delete(5000));
        
        var balance = await db.fetch(`userBalance_${user.id}`)
        
        if (balance === null) balance = 0;
        
        var embed = new Discord.RichEmbed()
        .setTitle('Coin Balance')
        .setDescription(`${user.username}, **your balance:\n:dollar: $${balance}**`)
        .setColor('#ffffff')
        .setFooter('Requested By ' + message.author.tag, message.author.avatarURL)
        message.channel.send(embed)

}
exports.conf = {
aliases: [""]
}
module.exports.help = {
name: "balance"
}