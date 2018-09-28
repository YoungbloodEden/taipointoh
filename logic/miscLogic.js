var config = require('../config.json')



function help(msg, client){
  msg.reply(`The current prefix is set to: \`${config.nfo.prefix}\`\n
  Here is a list of my commands: \n` +
  `\`\`\`css\n
[help:] The command you're using now.\n
[yt:] Command for searching youtube for a video. Anything following the command will be treated as a search string. From there, you can choose which video fits your search from a list of results.\n
[queue:] Command to see what's in queue to play via YouTube.\n
[qdel:] Takes a queue position (number) to remove from the current queue. \n
[qjump:] Takes a queue position (number) to jump to the front of the queue.\n
[qsave:] Command to save the current YouTube queue. \n
[qget:] Command to retrieve the saved YouTube queue. \n
[skip:] Skips the currently playing song.\n
[volume:] or [vol:] Command to set the volume for playback. Takes a number between 1 and 100, rounded down.\n
[disc:] Command to force a disconnect from any voice channel.\n
\`\`\``);
}

module.exports = {
  help : help
}
