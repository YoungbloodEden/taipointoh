var config = require('../config.json');

var message, command;


var keys = {
  yt : "yt"
}

var keysLength = (Object.keys(keys).length);

function prefixCheck(msg){
  message = msg.content.split(" ");
  if (message[0].charAt(0) == `${config.nfo.prefix}`){
    command = message[0].substr(1);
    commandCheck(message, command);
  }
}

function commandCheck(msg, cmd){
  console.log(cmd);
  console.log(msg);
}

module.exports = {
  prefixCheck : prefixCheck
}
