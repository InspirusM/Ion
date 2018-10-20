const Discord = require("discord.js");

module.exports.run = async (bot, message, args) =>{
  message.guild.fetchInvites().then(invs => {
    let user = message.mentions.users.first() || message.author
    let personalInvites = invs.filter(i => i.inviter.id === user.id);
    let inviteCount = personalInvites.reduce((p, v) => v.uses + p, 0);
message.channel.send(`${user} has ${inviteCount} invites.`);
})
}
exports.conf = {
aliases: [""]
}
module.exports.help = {
  name: "invites"
}