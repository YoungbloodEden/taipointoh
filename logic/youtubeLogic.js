var ytdl    = require('ytdl-core'),
    request = require ('request'),
    config  = require ('../config.json'),
    Discord = require ('discord.js');


var streamOptions = { seek: 0, volume: 1 };

function volume(content, msg, client){
  var v = parseInt(content);
  if (v > 100){
    msg.channel.send("I can't put the volume that high! (1-100)");
  } else if (v < 1){
    msg.channel.send("I can't put the volume that low! (1-100)");
  } else if (v >= 1 && v <= 100){
    v = parseFloat((v/100).toFixed(2));
    streamOptions.volume = v;
    msg.channel.send("Volume has been set to " + (v*100) + "%");
    console.log(streamOptions);
  } else {
    msg.channel.send("That's not a valid volume! (1-100)");
  }
}

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
      msg.reply("Here's what I found. Playing it now! \`\`\`ml\n" + `${response.items[0].snippet.title}`+"\`\`\`");
      playback(msg, response.items[0].id.videoId, client);
    }
    responseCollector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 10000});
    responseCollector.on('collect', msg => {
      var newResponse = msg.content;
      switch(newResponse){
          case '1':
            msg.reply(`\`\`\`ml\nOption 1. Chosen  \"${response.items[0].snippet.title}\"\`\`\``);
            playback(msg, response.items[0].id.videoId, client);
            break;

          case '2':
            if (!`${response.items[1]}`){
              msg.reply("Not a valid choice!")
            }
            msg.reply(`\`\`\`ml\nOption 2. Chosen \"${response.items[1].snippet.title}\"\`\`\``);
            playback(msg, response.items[1].id.videoId, client);
            break;

          case '3':
            if (!`${response.items[2]}`){
              msg.reply("Not a valid choice!");
            }
              msg.reply(`\`\`\`ml\nOption 3. Chosen  \"${response.items[2].snippet.title}\"\`\`\``);
              playback(msg, response.items[2].id.videoId, client);
            break;

          default:
            msg.reply("Not recognized. Please retry!")
            break;
        }
      })
    })
  }

function playback(msg, link, client){

  var stream = ytdl(`https://www.youtube.com/watch?v=${link}`, {filter: "audioonly"});

  msg.member.voiceChannel.join()
  .then(connection => {
    const dispatcher = connection.playStream(stream, streamOptions);
    dispatcher.on('end', endmsg => {
      disconn(msg, client, connection);
    })
  })
  .catch(console.error);
}

function disconn(msg, client, connection){
  if (connection){
    console.log(connection.disconnect());
    console.log("+++++++++++++++");
    console.log(client.voiceConnections.first());
    // setTimeout(client.voiceConnections.first().disconnect(), 1000);
  } else {
    if (client.voiceConnections.first()){
      client.voiceConnections.first().disconnect();
    }
  }
}

module.exports = {
  search : search,
  disconn : disconn,
  volume: volume
}
