const Discord = require('discord.js')
module.exports.run = (client, message, args) => {
   
    if (!args[0]) return message.reply("Please specify the bug eg: &bug testing");
    args = args.join(" ");
    message.reply("Thanks For Reporting Bug Has Been Submited We Will Soon Fix It");
    let bug = new Discord.RichEmbed()
    .setTitle(`Bug Reported By **${message.author.username}#${message.author.discriminator}** Author ID ${message.author.id}`)
    .setImage(message.author.displayAvatarURL)
    .setDescription(`Bug Reported In Server ${message.guild.name} ID ${message.guild.id}\nBug-\n **${args}**`)
    client.channels.get('503036476481601536').send(bug)
}

exports.conf = {
aliases: [""]
}
exports.help = {
  name: 'bug',

};//481752692566392834