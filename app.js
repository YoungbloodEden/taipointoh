const Discord  = require('discord.js'),
      config   = require('./config.json'),
      core     = require('./logic/coreLogic.js'),
      mongoose = require('mongoose'),
      mongcon  = require('mongodb').MongoClient
      Command   = require('./models/command.js').commandModel;


var mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/tai2';
mongoose.connect(mongoURI);

// var db = mongoose.connecton;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   console.log('connected, we gucci');
// })


const botclient = new Discord.Client();
botclient.on('ready', () => {
  console.log(`Ready to rock, hit me with commands.`);
});

botclient.on('message', msg => {
  if (msg.author == botclient.user){
    return;
  }
  core.core(msg, botclient);
  console.log(botclient.voiceConnections[1])
  var command = new Command({ command: msg.content, user: msg.author, gop: msg.guild});
  console.log(command.user);
  // msg.reply(" "+command.user.id+command.user.avatar+command.user.username+command.user.bot+" ");
})

botclient.login(config.nfo.token);
