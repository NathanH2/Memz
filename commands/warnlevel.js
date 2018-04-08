const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!message.member.hasPermission("SEND_MESSAGES")) return message.reply("You can't do that.")
    if(args[0] == "help"){
        message.reply("Usage: ~warnlevel <user>")
        return;
    }
    if(!wUser) return message.reply("Couldn't find that user.")
    if(!warns[wUser.id]) return message.channel.sendMessage(`<@${wUser.id}> has 0 warnings.`);
    let warnlevel = warns[wUser.id].warns;
    
    message.reply(`<@${wUser.id}> has ${warnlevel} warnings.`);
}

module.exports.help = {
    name: "warnlevel"
}