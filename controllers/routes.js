var users = require('../models/userSchema.js')
var bcrypt = require('bcryptjs') //bcrypt is required here and in the passportConfig file
var passport =  require('passport')

// function getCountries(req, res){
// 	countries.find({}, function(err, doc){
// 		console.log('sending countries')
// 		res.send(doc)
// 	})
// }

function addNewUser(req, res){
	bcrypt.genSalt(11, function(err, salt){
		bcrypt.hash(req.body.password, salt, function(hashError, hash){
			var person = new users({
				name     : req.body.username,
				email    : req.body.email,
				password : hash,
			})
			person.save(function(saveErr, user){
				if (saveErr) {res.send({err:saveErr}) }
				else {
					req.login(user, function(loginErr){ //save user and also logs in
						if (loginErr){res.send({err:loginErr}) }
						else {res.send({success: user}) }
					})
				}
			})
		})
	})	
}

module.exports = {
	addNewUser: addNewUser,
}