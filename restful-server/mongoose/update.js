var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UpdateSchema = new Schema({
    change: String,
    words: [],
    id_user: {type: Number},
    pendingApprobed: String
});


module.exports = mongoose.model('Update',UpdateSchema);