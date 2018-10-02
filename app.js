const Discord  = require('discord.js'),
      config   = require('./config.json'),
      core     = require('./logic/coreLogic.js'),
      mongoose = require ('mongoose');



const botclient = new Discord.Client();
botclient.on('ready', () => {
  console.log(`Ready to rock, hit me with commands.`);
  var himself = botclient.user;
});

botclient.on('message', msg => {
  if (msg.author == botclient.user){
    return;
  }
  core.core(msg, botclient);
  console.log(botclient.broadcasts);
})

botclient.login(config.nfo.token);
