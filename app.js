var Discord = require('discord.js'),
    config  = require('./config.json');


var himself = false;

const botclient = new Discord.Client();
botclient.on('ready', () => {
  console.log(`Ready to rock, hit me with commands.`);
  // console.log(botclient);
  var himself = botclient.user;
});

botclient.on('message', msg => {
  // console.log(msg.author);
  if (msg.author == botclient.user){
    himself = true;
  }
  if (himself){
    console.log("Can't reply to myself");
    return;
  }
  if (msg.content == 'hello new tai') {
    msg.reply('Hello.');
  }
})

botclient.login(config.nfo.token);
