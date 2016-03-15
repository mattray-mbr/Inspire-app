var users = require('../models/userSchema.js')
var posts = require('../models/postsSchema.js')
var bcrypt = require('bcryptjs') //bcrypt is required here and in the passportConfig file
var passport =  require('passport')
var s3 = require('s3')

s3Client = s3.createClient({
	s3Options: {
	 
	}
})


function addNewUser(req, res){
	bcrypt.genSalt(11, function(err, salt){


		bcrypt.hash(req.body.password, salt, function(hashError, hash){
			var person = new users({
				username : req.body.username,
				email    : req.body.email,
				password : hash,
				admin    : true,
			})
			person.save(function(saveErr, user){
				if (saveErr) {res.send({'person save error':saveErr}) }
				else {
					req.logIn(user, function(loginErr){ //save user and also logs in
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
		if(err){
		console.log('error logging in user')
		return next(err); }
		if(!user) {return res.send({error: 'cannot login user'}); }
		req.logIn(user, function(err) {
			if(err) { return next(err); }
			return res.send({user: req.user});
		})
	})(req, res, next);
}

function logOutUser(req, res, next){
		req.logOut()
		console.log('user has been logged out')
		res.redirect('/')
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

function postItem(req, res){
	console.log('making a new post')
	console.log(req.body)
	//set variables so I dont have to write req.body.data everywhere
	var body = req.body.data
	var file = req.files.files
	

	//initialize the upload
	var uploader = s3Client.uploadFile({
		localFile : file.path,
		s3Params  :{
			Bucket : 'spark-storage',
			//Key : '/stuff/' + file.name, // filepath on the bucket where the image will live
			Key    : file.name,
			ACL    : 'public-read', //access control
		}
	})

	//reports back on progress of the upload
	uploader.on('progress', function(){
		console.log('progress', uploader.progressAmount, uploader.progressTotal)
	})

	//once the file is done uploading
	uploader.on('end', function(){
		var url = s3.getPublicUrlHttp('spark-storage', file.name)  // url is not correct
	
		var post = new posts({
			name       : req.body.data.name,  
			type       : req.body.data.type,
			content    : req.body.data.message,
			rating     : 0,
			flagged    : false,
			archieved  : [],
			visible    : true,
			timestamp  : req.body.data.timestamp,
			files      : url, //url that comes back from s3
			outsource  : req.body.data.outsource,
			hasArchieve: false,
		})
		console.log('this is the post', post)
		post.save(function(err, docs){
			if(err){
				console.log('error saving post in db', err)
			}
			res.send(docs)//send docs or just post?
		})
	})
}

function postItem2(req, res){
	console.log('post without added upload file')
	var post = new posts({
		name       : req.body.name,  
		type       : req.body.type,
		content    : req.body.message,
		rating     : 0,
		flagged    : false,
		archieved  : [],
		visible    : true,
		timestamp  : req.body.timestamp,
		files      : '',
		outsource  : req.body.outsource,
		hasArchieve: false,
	})
	post.save(function(err, docs){
		if(err){
			console.log('error saving post in db', err)
		}
		res.send(docs)//send docs or just post?
	})
}

function getposts(req, res){
	console.log('retrieving all posts')
	posts.find({}, function(err, doc){
		res.send(doc)
	})
}

function updateUserArchieve(req, res){
	console.log('update info', req.body)
	posts.findOne({_id: req.body.postID}) //find matching post for request
		 //update post archieve array with username
		.exec(function(err, doc){
			post.archieved.push(req.body.userNAME)
			console.log('push username into archieved array')
		})
}

function flagPost(req, res){
	posts.update({_id: req.body._id}, req.body, function(err, updated){
		//update post then the new req.body
		posts.findOne({_id: req.body._id}, function(err, post){
			res.send(post)
		})
	})
}

function getFlaggedPosts(req, res){
	//find only posts with flagged value of true
	posts.find({flagged: true}, function(err, doc){
		res.send(doc)
	})
}

function deletePost(req, res){
	console.log('find and delete post', req.body._id)
	posts.remove({_id: req.body._id}, function(err, doc){
		if(err){
			console.log(err)
		} else {
			res.send('???')
		}
	})
}

function unflagPost(req, res){
	post.update({_id: req.body._id}, req.body, function(err, updated){
		posts.findOne({_id: req.body._id}, function(err, post){
			res.send(post)
		})
	})
}

function userArchieves(req, res){
	// find posts with archieved[req.params.username]
	posts.find({archieved: req.params.userNAME}, function(err, docs){
		if(err){
			console.log(err)
		} else {
			res.send(docs)
		}
	})
}

function userPosts(req, res){
	console.log('finding only logged in users posts')
	console.log(req.params.userNAME)
	//find posts with username of req.params.userNAME
	posts.find({name: req.params.userNAME}, function (err, docs){
		if(err){
			console.log(err)
		} else {
			res.send(docs)
		}
	})
}

function updateRating(req, res){
	posts.update({_id: req.body._id}, req.body, function(err, updated){
		posts.findOne({_id: req.body._id}, function(err, post){
			res.send(post)
		})
	})
}

function savePost(req, res){
	posts.update({_id: req.body._id}, req.body, function(err, updated){
		posts.findOne({_id: req.body._id}, function(err, post){
			res.send(post)
		})
	})
}


module.exports = {
	addNewUser         : addNewUser,
	logInUser          : logInUser,
	userProfile        : userProfile,
	getUser            : getUser,
	logOutUser         : logOutUser,
	postItem           : postItem,
	postItem2          : postItem2,
	getposts           : getposts,
	updateUserArchieve : updateUserArchieve,
	flagPost           : flagPost,
	getFlaggedPosts    : getFlaggedPosts,
	deletePost         : deletePost,
	unflagPost         : unflagPost,
	userArchieves      : userArchieves,
	userPosts          : userPosts,
	updateRating       : updateRating,
	savePost           : savePost,
	
}