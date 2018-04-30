var Discord = require('discord.js'),
    config  = require('./config.json'),
    core    = require('./logic/coreLogic.js');


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
  } else {
    himself = false;
  }
  if (himself){
    console.log("Ignoring my own messages.");
    return;
  }
  core.core(msg);
})

botclient.login(config.nfo.token);
