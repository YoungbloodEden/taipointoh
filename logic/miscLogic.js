var config = require('../config.json')



function help(msg, client){
  msg.reply(`The current prefix is set to: \`${config.nfo.prefix}\`\n
  Here is a list of my commands: \n` +
  `\`\`\`css\n
[help:] The command you're using now.\n
[yt:] Command for searching youtube for a video. Anything following the command will be treated as a search string. From there, you can choose which video fits your search from a list of results.\n
[volume:] Command to set the volume for playback. Takes whole numbers between 1 and 100\n
[disc:] Command to force a disconnect from any voice channel.\n\`\`\``);
}

module.exports = {
  help : help
}
