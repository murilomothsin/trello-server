var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Task = require('./Task.js');

var BoardSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    tasks: [Task.schema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Board', BoardSchema);