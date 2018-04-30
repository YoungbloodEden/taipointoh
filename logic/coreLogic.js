var config = require('../config.json');
var parse = require ('./parsing.js');


var conn;

function core(msg, client){
  if (msg.content == `${config.nfo.prefix}disc`){
    if (client.voiceConnections){
      client.voiceConnections.first().disconnect();
      console.log('++++');
      // voiceConnections.disconnect();
      console.log("Disconnected due to disc command");
    }
  } else {
    parse.prefixCheck(msg, client);
  }
}

module.exports = {
  core : core
}
