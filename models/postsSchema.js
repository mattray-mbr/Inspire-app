var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
	name         : {type: String, required: true},
	type         : {type: Number, required: true},
	content      : {type: String, required: true},
	rating       : {type: Number, required: true},
	flagged      : {type: Boolean,required: true},
	archieved    : {type: Boolean,required: true},
	visible      : {type: Boolean,required: true},

})

module.exports = mongoose.model('posts', postSchema)