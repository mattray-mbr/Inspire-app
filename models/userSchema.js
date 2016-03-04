var mongoose = require('mongoose')

var userSchema = mongoose.Schema({
	username     : {type: String, required: true, unique: true},
	email        : {type: String, required: true},
	password     : String,
})

module.exports = mongoose.model('users', userSchema)