const Discord = require("discord.js")
const moment = require("moment");
const m = require("moment-duration-format");
let os = require('os');
let cpuStat = require("cpu-stat");
const ms = require("ms");
var prettyMs = require('pretty-ms');
var oss = require('os-utils');

exports.run = (client, message, args) => { 
  let bicon = client.user.displayAvatarURL;
  let cpuLol;
  cpuStat.usagePercent(function(err, percent, seconds) {
    if (err) {
      return console.log(err);
    }
  const duration = moment.duration(client.uptime).format(" D [days], H [hrs], m [mins], s [secs]");
  const embedStats = new Discord.RichEmbed()
    .setAuthor(client.user.username)
    .setTitle("Bot Stats")
    .setColor("RANDOM")
    .setThumbnail(bicon)
    .addField(":bust_in_silhouette: Users", `${client.users.size.toLocaleString()}`, true)
    .addField(":bar_chart: Servers", `${client.guilds.size.toLocaleString()}`, true)
    .addField(":bookmark: Channels ", `${client.channels.size.toLocaleString()}`, true)
    .addField(":satellite: Library Version",`${Discord.version}`)
    .addField(":stopwatch: Bot Uptime / Api Ping ", `${duration} / ${Math.round(client.ping)}ms `, true)
    .addField(":stopwatch: Server Uptime", `${prettyMs(oss.sysUptime())} `, true)
  message.channel.send(embedStats)
  });
}
exports.conf = {
aliases: [""]
}
exports.help = {
  name: "stats",
  category: "Miscelaneous",
  description: "Gives some useful bot statistics",
  usage: "info"
};