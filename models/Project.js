var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Board = require('./Board.js');

var ProjectSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    boards: [Board.schema],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);