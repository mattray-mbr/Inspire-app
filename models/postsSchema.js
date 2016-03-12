var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
	name         : {type: String, required: true},
	type         : {type: Number, required: true},
	content      : {type: String, required: true},
	rating       : {type: Number, required: true},
	flagged      : {type: Boolean,required: true},
	archieved    : {type: Array},
	visible      : {type: Boolean,required: true},
	timestamp    : {type: Number, required: true},
	files        : {},
	outsource    : {type: String},

})

module.exports = mongoose.model('posts', postSchema)