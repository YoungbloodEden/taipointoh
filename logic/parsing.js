var config  = require('../config.json');
var youTube = require('./youtubeLogic.js');

var message, command;


var keys = {
  yt : "yt",
  volume : "volume"
}

var keysLength = (Object.keys(keys).length);

function prefixCheck(msg, client){
  message = msg.content.split(" ");
  if (message[0].charAt(0) == `${config.nfo.prefix}`){
    command = message[0].substr(1);
    commandCheck(message, command, msg, client);
  }
}

function commandCheck(content, cmd, msg, client){
  switch(cmd){
    case "yt":
      content.splice(0,1);
      content = content.join(' ');
      youTube.search(content, msg, client);
      break;
    case "volume":
      content.splice(0,1);
      content = content.join('');
      youTube.volume(content, msg, client);
      break;
    default:
      break;
  }
}

module.exports = {
  prefixCheck : prefixCheck
}
