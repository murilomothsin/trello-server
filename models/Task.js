var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TaskSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    responsibles: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Task', TaskSchema);