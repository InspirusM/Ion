const Discord = require("discord.js");


module.exports.run = async (bot, message, args) => {

  if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("This Command Requires `MANAGE_MESSGAES` Permission")
  if(!args[0]) return message.channel.send("Please, Specify Number of Messages To Delete");
  message.channel.bulkDelete(args[0]).then(() => {
    message.channel.send(`Cleared ${args[0]} messages.`).then(msg => msg.delete(3000));
  });
}
exports.conf = {
aliases: [""]
}
module.exports.help = {
  name: "clear"
}
