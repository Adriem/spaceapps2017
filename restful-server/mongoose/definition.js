var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var DefinitionSchema = new Schema({
    text: String,
    words: [],
    positive_vote: {type: Number, default: 0},
    negative_vote: {type: Number, default: 0}
});


module.exports = mongoose.model('Definition',DefinitionSchema);