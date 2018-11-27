const mongoose = require('mongoose');

var commandSchema = new mongoose.Schema({
  command: String,
  user: Object,
  gop: Object,
})

var commandModel = mongoose.model('Command', commandSchema);

module.exports = {
  commandModel : commandModel
}
