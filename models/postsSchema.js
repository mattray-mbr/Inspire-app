var mongoose = require('mongoose')

var postSchema = mongoose.Schema({
	username     : {type: String, required: true, unique: true},
	type         : Number, 
	message      : {type: String, required: true},
})

module.exports = mongoose.model('posts', userSchema)