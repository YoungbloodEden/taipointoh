var config = require('../config.json');
var parse = require ('./parsing.js');
var youTube = require('./youtubeLogic.js');


var conn;

function core(msg, client){
  if (msg.content == `${config.nfo.prefix}disc`){
    if (client.voiceConnections){
      youTube.disconn(msg, client);
    }
  } else {
    parse.prefixCheck(msg, client);
  }
}

module.exports = {
  core : core
}
