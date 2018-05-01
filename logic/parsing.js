var config  = require('../config.json');
var youTube = require('./youtubeLogic.js');
var miscLog = require('./miscLogic.js');
var memeLog = require('./memeLogic.js');

var message, command;

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
      console.log(content.length);
      if (content.length < 1){
        youTube.volumeReport(msg, client);
        return;
      } else {
        content = content.join('');
        youTube.vol(content, msg, client);
      }
    break;

    case "queue":
      youTube.viewQueue(msg, client);
    break;

    case "help":
      miscLog.help(msg, client);
    break;

    case "skip":
      youTube.youtubeSkip(msg, client);
    break;

    case "qdel":
      content.splice(0,1);
      if (content.length < 1){
        msg.reply("Choose a song to remove by its queue position.");
      } else {
        content = content.join('');
        youTube.queueDeleteAt(content, msg, client);
      }
    break;

    case "qjump":
      content.splice(0,1);
      if(content.length < 1){
        msg.reply("Choose a song to jump forward by its queue position.");
      } else {
        content = content.join('');
        youTube.queueMoveToFront(content, msg, client);
      }

    case "meme":
      memeLog.menu(msg, client);
    break;

    default:
    break;

  }
}


module.exports = {
  prefixCheck : prefixCheck,
}
