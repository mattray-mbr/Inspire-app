var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
	name         : String,
	email        : String,
	message      : String,
})

module.exports = mongoose.model('users', userSchema)