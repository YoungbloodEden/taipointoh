var ytdl    = require ('ytdl-core'),
    request = require ('request'),
    config  = require ('../config.json'),
    Discord = require ('discord.js'),
    parsing = require ('./parsing.js'),
    fs      = require ('fs'),
    qStuff  = require ('../storage/queue.json');


var streamOptions = { seek: 0, volume: .5 },
    dispatcher = {},
    queue = [],
    names = [],
    streamComplete = true;
    dispatcher.destroyed = true;

var toSave;

function vol(content, msg, client){
  var v = parseInt(content);
  if (v === 667){
    msg.channel.send("weak3n camp solo lane, weak3n numbah waannnn !")
  }
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
    dispatcher.on('end', endmsg => {
      streamComplete = true;
      if (queue.length == 1){
        queueRemove();
        disconn(msg, client, connection);
      } else if (queue.length > 1){
        queueRemove();
        playback(msg, client);
      }
    })
  })
  .catch(console.error);
}

function disconn(msg, client, connection){
  if(queue.length >= 2){
    msg.reply("You have a currently active queue. Disconnecting will clear it, are you sure you want to do this? (Y to confirm)");
    resCollector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 10000});
    resCollector.on('collect', collected => {
      var resContent = collected.content.toLowerCase();
      if (resContent == "y" || resContent == "yes" || resContent == "ye"){
        queue = [];
        names = [];
        if(client.voiceConnections.first()){
          client.voiceConnections.first().disconnect();
        } else {
          msg.reply("Nothing to disconnect from.");
        }
      } else {
        msg.reply("Cancelling disconnect!");
      }
    })
  } else {
    msg.reply("Cancelling disconnect!");
  }
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
  } else {
    msg.reply(`Moved ${names[m]} to the front of the queue.`);
    queue.splice(1,0,queue.splice(m,1));
    names.splice(1,0,names.splice(m,1));
  }
}

function clearConfirmation(msg, client){

}

function qsave(msg, client){
  if (queue.length > 0){
    queueParse();
    fs.writeFile('./storage/queue.json', `{"queueStuff": { "names": [${toSave.queueStuff.names}], "queue": [${toSave.queueStuff.links}]}}`, function(err){
      if (err){
        console.log(err)
      } else {
        msg.channel.send(`Queue saved! Retrieve it with \`${config.nfo.prefix}qget\`!`);
      }
    });
  } else {
    msg.channel.send("There is no queue to save!");
  }
}

function queueParse(){
  toSave = {};
  toSave = {"queueStuff": {
    "names" : names,
    "links" : queue
  }};
  for(var i = 0; i < queue.length; i++){
    if(toSave.queueStuff.links[i].charAt(0) == "\""){
      continue;
    }
      toSave.queueStuff.names[i] = "\"" + toSave.queueStuff.names[i] + "\"";
      toSave.queueStuff.links[i] = "\"" + toSave.queueStuff.links[i] + "\"";
  }
}

function qget(msg, client){
  if (queue.length >= 2){
    msg.reply("You have a currently active queue. Grabbing a saved queue will clear it, are you sure you want to do this? (Y to confirm)");
    resCollector = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {maxMatches: 1, time: 10000});
    resCollector.on('collect', collected => {
      var resContent = collected.content.toLowerCase();
      if (resContent == "y" || resContent == "yes" || resContent == "ye"){
        if (dispatcher.destroyed == false){
          queue = [queue[0]];
          names = [names[0]];
          for (var j = 0; j < qStuff.queueStuff.queue.length; j++){
            queue.push(qStuff.queueStuff.queue[j].replace(/\"/g, ""));
            names.push(qStuff.queueStuff.names[j].replace(/\"/g, ""));
          }
        } else {
          for (var j = 0; j < qStuff.queueStuff.queue.length; j++){
            queue.push(qStuff.queueStuff.queue[j].replace(/\"/g, ""));
            names.push(qStuff.queueStuff.names[j].replace(/\"/g, ""));
          }
          playback(msg, client);
        }
        msg.reply("Queue cleared, new queue grabbed, maintaining current play if applicable.")
      } else {
        msg.reply("Cancelling grab!");
        return;
      }
    })
  } else {
    msg.reply("Grabbing new queue, maintaining current play if applicable.");
    if (dispatcher.destroyed == false){
      queue = [queue[0]];
      names = [names[0]];
      for (var j = 0; j < qStuff.queueStuff.queue.length; j++){
        queue.push(qStuff.queueStuff.queue[j].replace(/\"/g, ""));
        names.push(qStuff.queueStuff.names[j].replace(/\"/g, ""));
      }
    } else {
      for (var j = 0; j < qStuff.queueStuff.queue.length; j++){
        queue.push(qStuff.queueStuff.queue[j].replace(/\"/g, ""));
        names.push(qStuff.queueStuff.names[j].replace(/\"/g, ""));
      }
      playback(msg, client);
    }
  }
}


module.exports = {
  search : search,
  disconn : disconn,
  vol : vol,
  volumeReport : volumeReport,
  viewQueue : viewQueue,
  youtubeSkip : youtubeSkip,
  queueDeleteAt : queueDeleteAt,
  queueMoveToFront : queueMoveToFront,
  qsave : qsave,
  qget : qget,
}
