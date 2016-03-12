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
			console.log('move on to next step')
			next()
		} else {
			console.log('user is not authenticated')
			res.send('user is not authenticated')
		}
	}
}

app.isAuthenticatedAjax = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	console.log('auth block')
	res.redirect('/');
} 

//--------------- Routes ---------------  
//initial setup route
app.get('/', function(req, res) {
	res.sendFile('html/shell.html', {root : './public'});
});

app.post('/api/userBase', routes.addNewUser)

app.post('/api/logIn', routes.logInUser) 

app.get('/api/logOut', function(req, res){
	req.logOut()
	res.redirect('/')
})

//if user exists redirect to profile page
app.get('/api/profiles/:userID',app.isAuthenticatedAjax, function(req, res){ //middleware to see if user is logged in
	console.log('test one')
	res.sendFile('profile.html', {root : './public/html'})
})
app.get('/api/profiles/',app.isAuthenticatedAjax, function(req, res){ //middleware to see if user is logged in
	res.sendFile('profile.html', {root : './public/html'})
})

app.get('/api/archieve/:userID', app.isAuthenticatedAjax, function(req, res){
	console.log('archieve test')
	res.sendFile('archieve.html', {root : './public/html'})
})

app.get('/api/me', function(req, res){
	console.log('getting user info')
    res.send({user:req.user})
})

app.post('/api/newPost', app.isAuthenticatedAjax, routes.postItem)

app.get('/api/getposts', routes.getposts)

app.post('/api/userArchieve', routes.updateUserArchieve)

app.post('/api/flagging/', routes.flagPost)

app.get('/api/getFlaggedPosts', routes.getFlaggedPosts)

app.post('/api/deletePost', routes.deletePost)

app.post('/api/unflagPost', routes.unflagPost)

app.get('/api/getArchievePosts/:userNAME/',app.isAuthenticatedAjax, routes.userArchieves)

app.get('/api/getUserPosts/:userNAME/', app.isAuthenticatedAjax, routes.userPosts)

app.get('/profiles/:userID', routes.getUser)

// Creating Server and Listening for Connections 
var port = 3173
app.listen(port, function(){
  console.log('Server running on port ' + port);

})

























