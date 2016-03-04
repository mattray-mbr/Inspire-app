// initial setup
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var routes = require('./controllers/routes.js')

//passport setup
var passport = require('passport');
var passportConfig = require('./models/passportConfig.js')

var app = express();
mongoose.connect('mongodb://localhost/inspire'); //connection to db(db name is inspire, colletion is users)

var session = require('express-session');
app.sessionMiddleware = session({
	secret: 'setting up server and stuff', //doesn't really matter whats in here
	resave: false,
	saveUninitialized: true
})
app.use(app.sessionMiddleware) 

//----------- passport hook ---------------
app.use(passport.initialize());
app.use(passport.session());


// Application Configuration 
app.use(logger('dev')); //no idea what this does
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


//-------- middleware -------------
var passportMiddleware = {
	authCheck : function(req, res, next){
		if(req.isAuthenticated()){  //isAuthenticated is a built in method
			next()
		} else {
			res.send('user is not authenticated')
		}
	}
}


//--------------- Routes --------------- 
//initial setup route
app.get('/', function(req, res) {
	res.sendFile('html/index.html', {root : './public'});
});

app.post('/api/userBase', routes.addNewUser)

// app.post('/api/userBase', routes.addUser)

// Creating Server and Listening for Connections 
var port = 3173
app.listen(port, function(){
  console.log('Server running on port ' + port);

})