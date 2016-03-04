
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy; //used for on-site login
var User = require('./userSchema.js');
var bcrypt = require('bcryptjs') //use bcryptjs instead of bcrypt

passport.serializeUser(function(user, done){
	done(null, user.id);
});
passport.deserializeUser(function(id,done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});

//definin local strats 
passport.use(new LocalStrategy(  
	function(username, password,/* migth need parameter email*/ done){
		User.findOne({username: username }, function(err, user){
			if (err) { return done(err); } //no user match was found
			if (!user) {
				return done(null, false);
			}
			//user exists, check if password is correct
			bcrypt.compare(password, user.password, function(err, res){
				if (res === true){
					return done(null, user)// password was correct return user
				} else {
					return done(null, false) //password was incorrect, return nothing
				}
			})
		})
	}
));