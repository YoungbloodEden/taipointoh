var ytdl    = require('ytdl-core'),
    request = require ('request'),
    config  = require ('../config.json');

var resReq;

function search(args, msg, client){

  if (!args) { return };

  var searcher = msg.author;
  request(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${args}&key=${config.nfo.apiKey}`, function(err, res, body){
    response = JSON.parse(body);
    console.log("+++++");
    console.log(response);

    if (response.items.length > 1 && response.items.length >= 3){
      resReq = true;
      msg.reply("I found a few different results. Here's the top \'3.\' Which were you looking for? \`\`\`ml\n 1. " +  `${response.items[0].snippet.title}` + " \n 2. " + `${response.items[1].snippet.title}` + " \n 3. " + `${response.items[2].snippet.title}` + "\`\`\`")
    } else if (reponse.items.length > 1 && response.items.length < 3){
      resReq = true;
      msg.reply("I found a couple different results. Here they are Which were you looking for? \`\`\`ml\n 1. " +  `${response.items[0].snippet.title}` + " \n 2. " + `${response.items[1].snippet.title}` + "\`\`\`")
    } else if (response.items.length == 0){
      resReq = false;
      msg.reply("I wasn't able to find anything by searching that.");
    } else if (response.items.length == 1){
      resReq = false;
      msg.reply("Here's what I found. Playing it now! \`\`\`ml\n" + `${response.items[0].snippet.title}`+"\`\`\`")
    }

    if (resReq){
      client.on('message', msg2 => {
        if (msg2.author != searcher){
          return;
        } else {
          switch(msg2.content){
            case '1':
              msg2.reply("\`\`\`ml\nPlaying "+`${response.items.[0].snippet.title}` + "\`\`\`");
              !resReq;
              break;

            case '2':
              if (!`${response.items.[1]}`){
                msg2.reply("Not a valid choice!")
              }
              msg2.reply("\`\`\`ml\nPlaying "+`${response.items.[1].snippet.title}` + "\`\`\`");
              !resReq;
              break;

            case '3':
            if (!`${response.items.[2]}`){
              msg2.reply("Not a valid choice!");
            }
              msg2.reply("\`\`\`ml\nPlaying "+`${response.items.[2].snippet.title}` + "\`\`\`");
              !resReq;
              break;

            default:
              msg2.reply("Not recognized. Please retry!")
              !resReq
              break;
          }
        }
      })
    }
  })
}

module.exports = {
  search : search
}
