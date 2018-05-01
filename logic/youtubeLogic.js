var ytdl    = require('ytdl-core'),
    request = require ('request'),
    config  = require ('../config.json'),
    Discord = require ('discord.js');


var streamOptions = { seek: 0, volume: 1 },
    dispatcher,
    queue = [],
    names = [],
    streamComplete = true;

function vol(content, msg, client){
  var v = parseInt(content);
  if (v > 100){
    msg.channel.send("I can't put the volume that high! (1-100)");
  } else if (v < 1){
    msg.channel.send("I can't put the volume that low! (1-100)");
  } else if (v >= 1 && v <= 100){
    v = parseFloat((v/100).toFixed(2));
    streamOptions.volume = v;
    if (streamComplete == false){
      dispatcher.setVolume(v);
    }
    msg.channel.send("Volume has been set to " + (v*100) + "%");
    console.log(streamOptions);
  } else {
    msg.channel.send("That's not a valid volume! (1-100)");
  }
}

function volumeReport(msg, client){
  msg.channel.send("Volume: " + (parseFloat(streamOptions.volume)*100) + "%")
}

function search(args, msg, client){

  if (!args) { return };

  var searcher = msg.author;
  request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${args}&key=${config.nfo.apiKey}`, function(err, res, body){

    response = JSON.parse(body);

    if (response.items.length > 1 && response.items.length >= 3){
      msg.reply("I found a few different results. Here's the top 3. Which were you looking for? \`\`\`ml\n 1. " +  `${response.items[0].snippet.title}` + " \n 2. " + `${response.items[1].snippet.title}` + " \n 3. " + `${response.items[2].snippet.title}` + "\`\`\`")
    } else if (response.items.length > 1 && response.items.length < 3){
      msg.reply("I found a couple different results. Here they are Which were you looking for? \`\`\`ml\n 1. " +  `${response.items[0].snippet.title}` + " \n 2. " + `${response.items[1].snippet.title}` + "\`\`\`")
    } else if (response.items.length == 0){
      msg.reply("I wasn't able to find anything by searching that.");
    } else if (response.items.length == 1){
      msg.reply("Here's what I found. Adding automatically.\`\`\`ml\n" + `${response.items[0].snippet.title}`+"\`\`\`");
      pushNames(response.items[0].snippet.title);
      pushQueue(response.items[0].id.videoId);
      playback(msg, response.items[0].id.videoId, client);
    }
    responseCollector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 10000});
    responseCollector.on('collect', msg => {
      var newResponse = msg.content;
      switch(newResponse){
          case '1':
            msg.reply(`\`\`\`ml\nOption 1. Chosen  \"${response.items[0].snippet.title}\"\`\`\``);
            pushNames(response.items[0].snippet.title);
            pushQueue(response.items[0].id.videoId)
            if(streamComplete){
              playback(msg, client);
            }
            break;

          case '2':
            if (!`${response.items[1]}`){
              msg.reply("Not a valid choice!")
            }
            msg.reply(`\`\`\`ml\nOption 2. Chosen \"${response.items[1].snippet.title}\"\`\`\``);
            pushNames(response.items[1].snippet.title);
            pushQueue(response.items[1].id.videoId)
            if(streamComplete){
              playback(msg, client);
            }
            break;

          case '3':
            if (!`${response.items[2]}`){
              msg.reply("Not a valid choice!");
            }
              msg.reply(`\`\`\`ml\nOption 3. Chosen  \"${response.items[2].snippet.title}\"\`\`\``);
              pushNames(response.items[0].snippet.title);
              pushQueue(response.items[2].id.videoId);
              if(streamComplete){
                playback(msg, client);
              }
            break;

          default:
            msg.reply("Not recognized. Please retry!")
            break;
        }
      })
    })
  }

function playback(msg, client){

  var stream = ytdl(`https://www.youtube.com/watch?v=${queue[0]}`, {filter: "audioonly"});

  msg.member.voiceChannel.join()
  .then(connection => {
    streamComplete = false;
    dispatcher = connection.playStream(stream, streamOptions);
    console.log(dispatcher.destroyed);
    dispatcher.on('end', endmsg => {
      streamComplete = true;
      console.log(dispatcher.destroyed);
      if (queue.length == 1){
        queueRemove();
        disconn(msg, client, connection);
        console.log(dispatcher.destroyed);
        console.log(dispatcher.paused);
      } else if (queue.length > 1){
        queueRemove();
        playback(msg, client);
      }
    })
  })
  .catch(console.error);
}

function disconn(msg, client, connection){
  if(client.voiceConnections.first()){
    client.voiceConnections.first().disconnect();
  } else {
    msg.reply("Nothing to disconnect from.");
  }
  queue = [];
}


function queueRemove(){
  queue.splice(0,1);
  names.splice(0,1);
}

function queueRemoveAt(pos, msg, client){
  queue.splice((pos-1),1);
  names.splice((pos-1),1);
}

function pushNames(name){
  var namesLen = names.push(name);
  return namesLen;
}

function pushQueue(link){
  var queueLen = queue.push(link);
  return queueLen;
}

function youtubeSkip(msg, client){
  msg.reply(`\`\`\`css\nSkipping: \'${names[0]}\'\`\`\``);
  dispatcher.end();
}

function viewQueue(msg, client){
  if (names.length == 0){
    msg.reply("There is nothing in queue.");
    return;
  }
  var queueReply = ``
  queueReply += "Playing Now =>" + names[0] + "\n";
  for (var x = 1; x < names.length; x++){
    queueReply += ((x)+": \'"+names[x]+"\'\n")
  }
  msg.reply(`\`\`\`css\n${queueReply}\`\`\``);
}

function queueDeleteAt(content, msg, client){
  var p = parseInt(content);
  if (queue.length == 0){
    msg.reply("Nothing in queue to delete!");
  }
  if (p > queue.length){
    msg.reply("Not a valid queue position.");
  } else {
    msg.reply(`Removed ${names[p]} from queue.`);
    queueRemoveAt(p, msg, client)
  }
}

function queueMoveToFront(content, msg, client){
  var m = parseInt(content);
  if (queue.length == 0){
    msg.reply("Nothing in queue to move forward!");
  }
  if (m > queue.length){
    msg.reply("Not a valid queue position.");
  } else (
    msg.reply(`Moved ${names[m-1]} to the front of the queue.`);
    queue.splice(0,0,queue.splice(m-1,1));
    names.splice(0,0,names.splice(m-1,1));
  )
}

module.exports = {
  search : search,
  disconn : disconn,
  vol : vol,
  volumeReport : volumeReport,
  viewQueue : viewQueue,
  youtubeSkip : youtubeSkip,
  queueDeleteAt : queueDeleteAt,
  queueMoveToFront : queueMoveToFront
}
