var disp;
var Discord = require('discord.js');


function menu(msg, client){
  msg.reply(`Here's the meme menu, make a choice!\n
  \`\`\`css\n
  1. [excited]\n
  2. [fake news]\n
  3. [how could this happen]\n
  4. [here in my garage]\n
  5. [here in my garage full]\n
  6. [nice meme]\n
  7. [yes yes]\n\`\`\``)
  acceptResponse(msg, client);
}

function acceptResponse(msg, client){
  collectorRes = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 5000});
  collectorRes.on('collect', message => {
    var response = message.content;
    if (!message.member.voiceChannel){
      message.reply("You're not in a voice channel!")
    } else {
      switch(response){
        case '1':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/excited.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        case '2':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/fakenews.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        case '3':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/hcthtm.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        case '4':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/garaaaage.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        case '5':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/fullthing.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        case '6':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/nicememe.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        case '7':
          message.member.voiceChannel.join()
          .then(connection => {
            disp = connection.playFile(".sounds/yesyes.mp3");
            disp.on('end', endmsg => {
              client.voiceConnections.first().disconnect();
            })
          })
        break;

        default:
          message.reply("Not a valid choice! Cancelling.");
        break;
      }
    }
  })
}

module.exports = {
  menu : menu,
}
