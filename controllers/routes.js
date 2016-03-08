var users = require('../models/userSchema.js')
var bcrypt = require('bcryptjs') //bcrypt is required here and in the passportConfig file
var passport =  require('passport')


function addNewUser(req, res){
	bcrypt.genSalt(11, function(err, salt){
		console.log(req.body)
		bcrypt.hash(req.body.password, salt, function(hashError, hash){
			var person = new users({
				username : req.body.username,
				email    : req.body.email,
				password : hash,
			})
			person.save(function(saveErr, user){
				if (saveErr) {res.send({'person save error':saveErr}) }
				else {
					req.login(user, function(loginErr){ //save user and also logs in
						if (loginErr){res.send({'error loging in':loginErr}) }
						else {res.send({success: user}) }
					})
				}
			})
		})
	})	
}

function logInUser(req, res, next){
	passport.authenticate('local', function(err, user, info){
		if(err){return next(err); }
		if(!user) {return res.send({error: 'cannot login user'}); }
		req.logIn(user, function(err) {
			if(err) { return next(err); }
			return res.send({success: 'user was loged in'});
		})
	})(req, res, next);
}

function logOutUser(req, res, next){
		req.logout(user, function(err){
			if(err) {return next(err);}
			return res.send({success: 'user was logged out'})
		})
}

function userProfile(req, res){
	res.sendFile('profile.html', {root : './public/html/'})
}

function getUser(req, res){
	console.log('retrieving user profile')
	users.findOne({_id: req.params.userID})
	.exec(function(err, doc){
		console.log(doc)
		res.send(doc)
	})
}



module.exports = {
	addNewUser      : addNewUser,
	logInUser       : logInUser,
	userProfile     : userProfile,
	getUser         : getUser,
	logOutUser      : logOutUser,
	
}