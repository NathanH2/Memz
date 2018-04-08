const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return errors.noPerms(message, "MANAGE_ROLES");
    if(args[0] == "help"){
        message.reply("Usage: ~removerole <user> <role>")
        return;
    }
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0]);
    if(!rMember) return message.reply("Couldn't find that user.")
    let role = args.join(" ").slice(22);
    if(!role) return message.reply("Specify a role.");
    let gRole = message.guild.roles.find(`name`, role);
    if(!gRole) return message.reply("Couldn't find that role.");

    if(!rMember.roles.has(gRole.id)) return message.reply("They dont have that role");
    await(rMember.addRole(gRole.id));

    try{
        await rMember.send(`Aww, you have been remove from the role ${gRole.name}`)
    }catch(e){
    message.channel.send(`RIP to <@${rMember.id}> they have been remove from the role ${gRole.name}`)
    }

    message.delete().catch(O_o=>{});
}

module.exports.help = {
    name: "removerole"
}