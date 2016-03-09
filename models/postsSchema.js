var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
	username     : {type: String, required: true},
	type         : Number, 
	message      : {type: String, required: true},
})

module.exports = mongoose.model('posts', postSchema)