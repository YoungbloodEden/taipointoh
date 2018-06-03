var Discord = require('discord.js'),
    config  = require('./config.json'),
    core    = require('./logic/coreLogic.js');



const botclient = new Discord.Client();
botclient.on('ready', () => {
  console.log(`Ready to rock, hit me with commands.`);
  var himself = botclient.user;
});

botclient.on('message', msg => {
  // console.log(msg.author);
  if (msg.author == botclient.user){
    return;
  }
  core.core(msg, botclient);
})

botclient.login(config.nfo.token);
