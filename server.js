// Requires \\
var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var passport = require('passport');
// var sessions = require('express-sessions');
var bcrypt = require('bcryptjs');
var passportLocal = require('passport-local');
var routes = require('./controllers/routes.js')

// Create Express App Object \\
var app = express();

mongoose.connect('mongodb://localhost/inspire');
//db name is earth collection name is countries


// Application Configuration \\
app.use(logger('dev')); //no idea what this does
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes \\

app.get('/', function(req, res) {
	res.sendFile('html/index.html', {root : './public'});
});


//pulls in the controllers functions for concise code in this file
app.post('/addStuff', routes.addData)






// Creating Server and Listening for Connections \\
var port = 3173
app.listen(port, function(){
  console.log('Server running on port ' + port);

})