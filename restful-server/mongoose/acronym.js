var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AcronymSchema = new Schema({
    name: String,
    words: []
});


module.exports = mongoose.model('Acronym',AcronymSchema);