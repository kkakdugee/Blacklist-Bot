const Discord = require("discord.js");
const client = new Discord.Client();
const dotenv = require('dotenv'); 
dotenv.config();
client.login(process.env.TOKEN);

const serversArray = [];
const serverOwners = [];
var blacklisted = [];


client.on("message", message => {
    let checkOID = serverOwners.indexOf(message.author.id);
    if(checkOID != -1) {
        doBlacklist(message);
    }
    if(blacklisted.includes(message.content)) {
        try {message.delete();}
        catch(e){}
    }
})

function doBlacklist(message) {
    let content = message.content;
    if(content.toLowerCase().startsWith('blcheck')) {
        if(blacklisted.length != 0) {
            message.channel.send('Here are the current blacklisted words: ');
            message.channel.send(blacklisted);
        }
        else {
            message.channel.send('There are currently no words or phrases that are blacklisted.')
        }
    }
    else if(content.toLowerCase().startsWith('bl')) {
        var blacklistedPhrase = content.substring(content.indexOf("l") + 2);
        if(checkMutualServerOwners(message, message.guild.id)) {
            message.channel.send('Only the Server owner has permitted access to use this bot!');
            return;
        }
        else {
            blacklisted.push(blacklistedPhrase);
        }
    }
    return;
}


function checkMutualServerOwners(message, serverID) {
    let indexOfServerID = serversArray.indexOf(serverID);
    let checkID = message.author.id;
    let currentServerOwner = serverOwners[indexOfServerID];
    return checkID != currentServerOwner && serverOwners.indexOf(checkID) != -1;
}


client.on("ready", () => {
    console.log('good to go');
    console.log('');
    client.guilds.cache.forEach(g => {
        console.log(g.name);
        serversArray.push(g.id);
        serverOwners.push(g.ownerID);
    });
    client.user.setPresence({
        activity: {
            name: 'bl',
            type: "LISTENING",
        },
        status: "online"
    })
    .catch((error) => console.error(error));
});