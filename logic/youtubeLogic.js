var ytdl    = require('ytdl-core'),
    request = require ('request'),
    config  = require ('../config.json'),
    Discord = require ('discord.js');


function search(args, msg, client){

  if (!args) { return };

  var searcher = msg.author;
  request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${args}&key=${config.nfo.apiKey}`, function(err, res, body){

    response = JSON.parse(body);

    if (response.items.length > 1 && response.items.length >= 3){
      msg.reply("I found a few different results. Here's the top 3. Which were you looking for? \`\`\`ml\n 1. " +  `${response.items[0].snippet.title}` + " \n 2. " + `${response.items[1].snippet.title}` + " \n 3. " + `${response.items[2].snippet.title}` + "\`\`\`")
    } else if (reponse.items.length > 1 && response.items.length < 3){
      msg.reply("I found a couple different results. Here they are Which were you looking for? \`\`\`ml\n 1. " +  `${response.items[0].snippet.title}` + " \n 2. " + `${response.items[1].snippet.title}` + "\`\`\`")
    } else if (response.items.length == 0){
      msg.reply("I wasn't able to find anything by searching that.");
    } else if (response.items.length == 1){
      msg.reply("Here's what I found. Playing it now! \`\`\`ml\n" + `${response.items[0].snippet.title}`+"\`\`\`")
    }
    responseCollector = new Discord.MessageCollector(msg.channel, m => m.author.id == msg.author.id, {maxMatches: 1, time: 10000});
    responseCollector.on('collect', msg => {
      var newResponse = msg.content;
      switch(newResponse){
          case '1':
            msg.reply("\`\`\`ml\nPlaying "+`${response.items[0].snippet.title}` + "\`\`\`");
            playback(msg, response.items[0].id.videoId);
            break;

          case '2':
            if (!`${response.items[1]}`){
              msg.reply("Not a valid choice!")
            }
            msg.reply("\`\`\`ml\nPlaying "+`${response.items[1].snippet.title}` + "\`\`\`");
            playback(msg, response.items[1].id.videoId);
            break;

          case '3':
            if (!`${response.items[2]}`){
              msg.reply("Not a valid choice!");
            }
              msg.reply("\`\`\`ml\nPlaying "+`${response.items[2].snippet.title}` + "\`\`\`");
              playback(msg, response.items[2].id.videoId);
            break;

          default:
            msg.reply("Not recognized. Please retry!")
            break;
        }
      })
    })
  }

function playback(msg, link){

  const streamOptions = { seek: 0, volume: .5 };
  var stream = ytdl(`https://www.youtube.com/watch?v=${link}`, {filter: "audioonly"});

  msg.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playStream(stream, streamOptions);
    dispatcher.on('end', endmsg => {
      if (connection){
        setTimeout(connection.disconnect(), 1000);
      }
    })
  })
  .catch(console.error);
}

module.exports = {
  search : search
}
