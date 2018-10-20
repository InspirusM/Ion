const db = require('quick.db')

module.exports.run = (bot, message, args) => {

  if (!message.member.hasPermission('MANAGE_GUILD')) return message.channel.send('You do not have permission to set server autorole!');
  if (!args.join(' ')) return message.channel.send('Please provide a role name to set server autorole!');
  
  db.set(`autorole_${message.guild.id}`, args.join(' ')).then(autorole => {
    message.channel.send(`Server autorole has been set to **${autorole}**`);
  });
};
exports.conf = {
aliases: [""]
}
module.exports.help = {
name: 'autorole'
}
