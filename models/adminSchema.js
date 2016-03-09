var mongoose = require('mongoose')

var adminSchema = mongoose.Schema({
	username     : {type: String, required: true},
	email        : {type: String, required: true},
	password     : String,
})

module.exports = mongoose.model('admins', adminSchema)