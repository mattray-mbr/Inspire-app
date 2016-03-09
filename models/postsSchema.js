var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
	name         : {type: String, required: true},
	type         : {type: Number, required: true},
	message      : {type: String, required: true},
})

module.exports = mongoose.model('posts', postSchema)