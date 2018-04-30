var config = require('../config.json');

var prefixUsed;
var split;

var keys = {
  yt : "yt"
}

var keysLength = (Object.keys(keys).length);

function prefixCheck(msg){
  split = msg.content.split(" ");
  console.log(split);
  if (split[0][0] == `${config.nfo.prefix}`){
    commandCheck(msg);
  }
}

function commandCheck(msg){
  console.log("got to command check")
}

module.exports = {
  prefixCheck : prefixCheck
}
