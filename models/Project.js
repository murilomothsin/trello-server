var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProjectSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);