const Discord = require("discord.js");
const errors = require("../utils/errors.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
    if(args[0] == "help"){
        message.reply("Usage: ~ban <user> <reason>")
        return;
    }
    let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("Can't find user.");
    let bReason = args.join(" ").slice(22);
    if(bUser.hasPermission("MANAGE_ROLES")) return message.channel.send("That person can't be banned."); 

    let banEmbed = new Discord.RichEmbed()
    .setDescription("Ban")
    .setColor("#a50d0d")
    .addField("Banned User", `${bUser} with ID: ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID: ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    let incidentchannel = message.guild.channels.find(`name`, "logs");
    if(!incidentchannel) return message.channel.send("Can't find the logs channel.");

    message.delete().catch(O_o=>{});
    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed);
}

module.exports.help = {
    name: "ban"
}