const botconfig = require("./botconfig.json");
const Discord = require("discord.js")
const fs = require("fs");
const bot = new Discord.Client({disableEveryone: true});
bot.commands = new Discord.Collection();
let coins = require("./coins.json");
let xp = require("./xp.json");
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 5;

fs.readdir("./commands/", (err, files) => {

    if(err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js")
    if(jsfile.length <= 0){
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./commands/${f}`);
        console.log(`${f} loaded.`);
        bot.commands.set(props.help.name, props)
    });

});

bot.on("ready", async () => {
    console.log(`${bot.user.username} is online.`);
    bot.user.setActivity("with JavaScript")
});



bot.on("guildMemberAdd", async (member) => {
    console.log(`${member.id} joined the server.`);

    var jUser = [
        `WATCH OUT! ${member} has joined the PARTY!`,
        `Welcome ${member} to the server!`,
        `Hello, ${member}. Nice to meet you.`,
        `Oh god ${member} has joined the server.`
    ];

    let welcomechannel = member.guild.channels.find(`name`, "join-leave");
    welcomechannel.send(jUser[Math.floor(Math.random() * jUser.length)]);

    member.addRole(member.guild.roles.find(`name`, "Waiting Rank Placement"));
});

bot.on("guildMemberRemove", async member => {
    console.log(`${member.id} joined the server.`);

    var lUser = [
        `Finally! ${member} has left the server.`,
        `I hope I will see you again, ${member}`,
        `Don't come back, ${member}`,
        `No wonder no one likes you, ${member}`
    ];

    let leavechannel = member.guild.channels.find(`name`, "join-leave");
    leavechannel.send(lUser[Math.floor(Math.random() * lUser.length)]);
});

bot.on("channelCreate", async channel => {
    
    console.log(`${channel.name} has been created.`);

    let sChannel = channel.guild.channels.find(`name`, "logs");
    sChannel.send(`${channel} has been created`);
})

bot.on("channelDelete", async channel => {

    console.log(`${channel.name} has been created.`);

    let sChannel = channel.guild.channels.find(`name`, "logs");
    sChannel.send(`${channel.name} has been deleted`);
})

bot.on("message", async message => {
    if(message.author.bot) return;
    if(message.channel.type === "dm") return;

    let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));

    if(!prefixes[message.guild.id]){
        prefixes[message.guild.id] = {
            prefixes: botconfig.prefix
        };
    }

    if(!coins[message.author.id]){
        coins[message.author.id] = {
            coins:0
        };
    }

    let coinAmt = Math.floor(Math.random() * 30) + 1;
    let baseAmt = Math.floor(Math.random() * 30) + 1;

    if(coinAmt === baseAmt){
        coins[message.author.id] = {
            coins: coins[message.author.id].coins + coinAmt
        };
    fs.writeFile("./coins.json", JSON.stringify(coins), (err) => {
        if (err) console.log(err)
    });
    let coinEmbed = new Discord.RichEmbed()
    .setAuthor(message.author.username)
    .setColor("#0000FF")
    .addField("💰", `${coinAmt} coins added!`);

    message.channel.send(coinEmbed).then(msg => {msg.delete(5000)});
    }

    let xpAdd = Math.floor(Math.random() * 7) + 8;

    if(!xp[message.author.id]){
        xp[message.author.id] = {
            xp: 0,
            level: 1
        };
    }
    
    let curxp = xp[message.author.id].xp;
    let curlvl = xp[message.author.id].level;
    let nxtLvl = xp[message.author.id].level * 500;
    xp[message.author.id].xp = curxp + xpAdd;
    if(nxtLvl <= xp[message.author.id].xp){
        xp[message.author.id].level = curlvl + 1;
        let lvlup = new Discord.RichEmbed()
        .setTitle("Level Up!")
        .setColor(purple)
        .setAuthor(message.author.username)
        .addField("New Level", curlvl + 1);

        message.channel.send(lvlup).then(msg => {msg.delete(5000)});
    }
    fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
        if(err) console.log(err)
    });

    let prefix = prefixes[message.guild.id].prefixes;
    if(!message.content.startsWith(prefix)) return;
    if(cooldown.has(message.author.id)){
        message.delete();
        return message.reply("You have to wait 2 seconds between commands.")
    }
    //if(!message.member.hasPermission("ADMINISTRATOR")){
        cooldown.add(message.author.id);
    //}
    
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);

    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if(commandfile) commandfile.run(bot,message,args);

    setTimeout(() => {
        cooldown.delete(message.author.id)
    }, cdseconds * 2000)

});

bot.login(botconfig.token);
