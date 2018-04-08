const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

    let helpembed = new Discord.RichEmbed()
    .setDescription("Help")
    .setColor("#26ce16")
    .addField("Member Commands", "help, 8ball, botinfo, coins, level, pay, ping, report, serverinfo and warnlevel");

    message.channel.send(helpembed);

    if(message.member.hasPermission("MANAGE_MESSAGES")){
    let modembed = new Discord.RichEmbed()
    .setDescription("Admin Help")
    .setColor("#26ce16")
    .addField("Administrative Commands", "addrole, ban, clear, kick, prefix, removerole, say, tempmute warn.");

    try{
        await message.author.send(modembed);
        message.react("👍")
    }catch(e){
        message.reply("Your DMs are locked. I cannot send you the help menu.")
    }
} 

}
module.exports.help = {
    name: "help"
}