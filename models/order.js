var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	displayName: { type: String, required: true },
	description: { type: String, required: true },
});

module.exports = mongoose.model('Order', schema);