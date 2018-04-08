const Discord = require("discord.js");
const fs = require("fs");
const ms = require("ms");
let warns = JSON.parse(fs.readFileSync("./warnings.json", "utf8"));

module.exports.run = async (bot, message, args) => {

    let wUser = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
    if(args[0] == "help"){
        message.reply("Usage: ~warn <user> <reason>")
        return;
    }
    if(!wUser) return message.reply("Couldn't find that user.")
    if(wUser.hasPermission("MANAGE_MESSAGES")) return message.reply("They just chillin bruh.")
    let reason = args.join(" ").slice(22);

    if(!warns[wUser.id]) warns[wUser.id] = {
        warns: 0
    };

    warns[wUser.id].warns++;

    fs.writeFile("./warnings.json", JSON.stringify(warns), (err) => {
        if (err) console.log(err)
    });
    
    let warnEmbed = new Discord.RichEmbed()
    .setDescription("Warns")
    .setAuthor(message.author.username)
    .setColor("#d3680a")
    .addField("Warned User", wUser.tag)
    .addField("Warned In", message.channel)
    .addField("Number of Warnings", warns[wUser.id].warns)
    .addField("Reason", reason);

    let warnchannel = message.guild.channels.find(`name`, "logs");
    if(!warnchannel) return message.reply("Couldn't find that channel");

    warnchannel.send(warnEmbed);

    if(warns[wUser.id].warns == 2){
        let muterole = message.guild.role.find(`name`, "Muted");
        if(!muterole) return message.reply("Mute role needs to be created.")

        let mutetime = "20m";
        await(wUser.addRole(muterole.id));
        message.channel.send(`${wUser.tag} has been temporarily muted`);

        setTimeout(function(){
            wUser.removeRole(muterole.id)
            message.channel.sendMessage(`${wUser.tag} has been unmuted`)
        }, ms(mutetime))
    }
    if(warns[wUser.id].warns == 3){
        message.guild.member(wUser).kick(reason);
        message.channel.sendMessage(`${wUser.tag} has been kicked.`)
    }

}

module.exports.help = {
    name: "warn"
}