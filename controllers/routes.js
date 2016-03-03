var routeController = require('../models/userSchema.js')

// function getCountries(req, res){
// 	countries.find({}, function(err, doc){
// 		console.log('sending countries')
// 		res.send(doc)
// 	})
// }

function addData(req, res){
	console.log(req.body)
	var person = new users({
		name     : req.body.name,
		email    : req.body.email,
		message  : req.body.message,
	})
	person.save()
	res.send('success')
}

module.exports = {
	addData: addData,
}