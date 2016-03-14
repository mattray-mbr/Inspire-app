var app = angular.module('inspire', ['ngRoute', 'ngFileUpload'])

app.config(function($routeProvider){
	//all the angular front end routes
	$routeProvider
		.when('/', {
			templateUrl : '/html/index.html',
			controller  : 'mainController'
		})
		.when('/about', {
			templateUrl : '/html/about.html',
			controller  : 'mainController'
		})
		.when('/tos', {
			templateUrl : '/html/tos.html',
			controller  : 'mainController'
		})
		.when('/contact', {
			templateUrl : '/html/contact.html',
			controller  : 'mainController'
		})
		.when('/admin', {
			templateUrl : '/html/admin.html',
			controller  : 'adminController'
		})
		.when('/profiles/:userID', {
			templateUrl : '/html/profile.html',
			controller  : 'profileController'
		})
		.when('/categories', {
			templateUrl : '/html/categories.html',
			controller  : 'mainController'
		})
		.when('/browseDrawing', {
			templateUrl : '/html/anon.html',
			controller  : 'anonController'
		})
		.when('/browsePainting', {
			templateUrl : '/html/anon.html',
			controller  : 'anonController'
		})
		.when('/browsePottery', {
			templateUrl : '/html/anon.html',
			controller  : 'anonController'
		})
		.when('/browseWood', {
			templateUrl : '/html/anon.html',
			controller  : 'anonController'
		})
})

//single module for app
	app.controller('mainController', ['$scope', '$http', function($scope, $http){
		//initial declarations
		$scope.noUser = true;
		$scope.ifUser = false;

		//initial request to see if any user is logged in
		function initial(){	 //put inside a function so that I can call it on login button and sign up
			$http({
				method  : 'GET',
				url     : '/api/me',
			}).then(function(returnData){
	            console.log('user info', returnData)
	            if (returnData.data.user) {
	            	console.log('user name', returnData.data.user.username)
	            	$scope.userNAME = returnData.data.user.username
	                $scope.noUser = false;
	                $scope.ifUser = true;
	                //redirect to profile page here
	                window.location.href = '/api/profiles/'+$scope.userNAME
	            } else {
	            	console.log('no user found')
	            	//no user so stay on page
	            }
	        })
		}

		$scope.signUp = function(){
			var person = {
				username: $scope.newUser.username,
				email: $scope.newUser.email,
				password: $scope.newUser.password,
			}
			$http.post('/api/userBase', person).then(function(returnData){
				$scope.display = returnData.data
				initial() 
			})
		}

		$scope.profile = function(){
			initial()
		}

	}])

	app.controller('profileController', ['$scope', '$http', 'Upload', '$sce', function($scope, $http, Upload, $sce){
		$scope.$sce = $sce
		var userNAME = window.location.pathname.split('/').pop()
		$scope.feed = []
		$scope.rateNum = {}
		var archieveName

		

		console.log('profile controller')

		//automatically gets posts in the feed
		$http.get('/api/getposts').then(function(returnData){
			$scope.feed = returnData.data
		})

		$http.get('/profiles/' + userNAME).then(function(serverResponse){
			console.log(serverResponse)
			$scope.loggedInUser = serverResponse.data
			isArchieved()
		})

		
		$scope.newPost = function(){
			console.log('files', $scope.post.files)


			var time = Date.now()
			var item = {
				name      : userNAME,
				type      : $scope.post.type,
				message   : $scope.post.message,
				timestamp : time, //post the current time in milisecond form
				files     : $scope.post.files, //object with file information
				outsource : $scope.post.outsource,
			}
			console.log($scope.post.files)
			if($scope.post.files === undefined){
				console.log('no user file uploaded')
				$http.post('/api/newPost2', item).then(function(returnData){
					console.log('posting new item')
					$scope.feed.push(returnData.data)
				})
			} else {
				console.log('user has added a file')
				//where the file is sent when uploaded
				Upload.upload({
				url  : '/api/newPost',
				data : {
					files : $scope.post.files,
					data  : item,
					}
				})
			}			
		}

		$scope.filter = function(num){
			console.log('setting filter')
			for(var i = 0; i < $scope.feed.length; i++){
				if(num === 0){
					$scope.feed[i].visible = true //shows all posts
				} else if(num === 4){
					if($scope.feed[i].rating < 3){
						$scope.feed[i].visible = false //hides all with rating below 3
					}
				} else if($scope.feed[i].type !== num){
					//hide unwanted posts
					$scope.feed[i].visible = false
				} else {
					$scope.feed[i].visible = true //
				}
			}
		}
		//====================
		function oldest(a,b){
			console.log('sorting by oldest')
			if (a.timestamp < b.timestamp)
			    return -1;
			  else if (a.timestamp > b.timestamp)
			    return 1;
			  else 
			    return 0;
		}
		function newest(a,b){
			console.log('sorting by newest')
			if (a.timestamp > b.timestamp)
			    return -1;
			  else if (a.timestamp < b.timestamp)
			    return 1;
			  else 
			    return 0;
		}
		function rating(a,b){
			console.log('sorting by rating')
			if (a.rating > b.rating)
				return -1;
			else if (a.rating < b.rating)
				return 1;
			else
				return 0;
		}

		function average(a, b){
			console.log('num 1 and 2',a, b)
			return Math.round((a+b)/2)
		}
		//=====================
		$scope.sortfeed = function(num){
			if(num === 2){ //date added acending
				$scope.feed.sort(oldest)
			} else if(num === 3){ //date added decending
				$scope.feed.sort(newest)
			} else if(num === 1){ //best rating first
				$scope.feed.sort(rating)
			}
			
		}

		$scope.search = function(){
			console.log($scope.searchword)
			for(var i = 0; i < $scope.feed.length; i++){
				//find all posts associated with the searchword
			}
		}

		 $scope.archieved = function(){
			window.location.href = '/api/archieve/'+userNAME
		}

		// $scope.archievePost = function(index){
		// 	console.log($scope.feed[index])
		// 	$http.post('/api/userArchieves', {username: userNAME, postID: $scope.feed[index]._id}).then(function(returnData){
		// 		console.log('info coming back from archieve update', returnData.data)
		// 	})
		// }

		$scope.flagPost = function(index){
			console.log('flagging post for delete')
			console.log($scope.feed[index].content)
			$scope.feed[index].flagged = true
			//send enitre object to be changed in the db
			$http.post('/api/flagging/', $scope.feed[index]).then(function(returnData){
				//do I need to return anything back?
				console.log(returnData.data)
			})
			$scope.isFlagged = 'isFlagged';
		}

		$scope.userPosts = function(){
			window.location.href = '/api/userPosts/' + userNAME
		}

		
		$scope.ratePost = function(index){
			var av
			console.log('rating post', index)
			console.log($scope.feed[index].rating)
			console.log($scope.rateNum['score'])
			var rateNum = parseInt($scope.rateNum['score'])
			if($scope.feed[index].rating === 0){
				av = rateNum
			} else {
				av = average($scope.feed[index].rating, rateNum)				
			}
			console.log(av)
			$scope.feed[index].rating = av
			$http.post('/api/updateRating/', $scope.feed[index]).then(function(returnData){
				$scope.feed[index] = returnData.data
			})
		}

		//change button if post is archieved
		function isArchieved(){
			// console.log('running?')
			for(var i = 0; i < $scope.feed.length; i++){
				// console.log('archieves??', $scope.feed[i].archieved)
				for(var j = 0; j < $scope.feed[i].archieved.length; j++){
					// console.log('???', $scope.feed[i].archieved[j])
					// console.log(userNAME)
					archieveName = $scope.feed[i].archieved[j]
					// console.log('test')
					if(archieveName === userNAME){
						console.log('match')
						$scope.feed[i].hasArchieve = true
						console.log($scope.feed[i].hasArchieve)
						 
					}
				}
			}
		}
		

		$scope.savePost = function(index){
			console.log('saving post to user archieves')
			$scope.feed[index].archieved.push(userNAME)
			console.log($scope.feed[index].archieved)
			$http.post('/api/saveArchieve/', $scope.feed[index]).then(function(returnData){
				$scope.feed[index] = returnData.data
				isArchieved()
			})
			
		}


	}])







	app.controller('archieveController', ['$scope', '$http', function($scope, $http){
		$scope.feed = []
		var archieveName

		var userNAME = window.location.pathname.split('/').pop()
		//send username with request to have something to match with in the database
		// $http.get('/api/getArchievePosts/:userNAME/').then(function(returnData){
		// 	console.log(returnData)
		// 	if(returnData.data === []){
		// 		$scope.feedError = true;
		// 	} else {
		// 		$scope.feed = returnData.data
		// 	}
		// })

		//automatically gets posts in the feed
		$http.get('/api/getposts').then(function(returnData){
			$scope.feed = returnData.data
		})

		$http.get('/profiles/' + userNAME).then(function(serverResponse){
			console.log(serverResponse)
			$scope.loggedInUser = serverResponse.data
			isArchieved()
		})

		//change button if post is archieved
		function isArchieved(){
			// console.log('running?')
			for(var i = 0; i < $scope.feed.length; i++){
				// console.log('archieves??', $scope.feed[i].archieved)
				for(var j = 0; j < $scope.feed[i].archieved.length; j++){
					// console.log('???', $scope.feed[i].archieved[j])
					// console.log(userNAME)
					archieveName = $scope.feed[i].archieved[j]
					// console.log('test')
					console.log(archieveName, userNAME)
					if(archieveName !== userNAME){
						console.log('match')
						$scope.feed[i].visible = false
						console.log($scope.feed[i].visible) 
					}
				}
			}
		}
	}])





	app.controller('userPostsController', ['$scope', '$http', function($scope, $http){
		$scope.feed = []
		var userNAME = window.location.pathname.split('/').pop()

		$http.get('/api/getUserPosts/'+userNAME).then(function(returnData){
			console.log(returnData.data)
			if(returnData.data === []){
				$scope.feedError = true;
			} else {
				$scope.feed = returnData.data
			}
		})

		$scope.deletePost = function(index){
		console.log('deleting a post')
		$http.post('/api/deletePost/', $scope.feed[index]).then(function(returnData){
			console.log(returnData)
		})
		//hide post that was just deleted
	}



	}])


	app.controller('headerController', ['$scope', '$http', function($scope, $http){

		$scope.ifUser = false;
		$scope.user = {} //!important! needs to initialize as an empty objects in order to bind values to it

		function initial(){	 //put inside a function so that I can call it on login button and sign up
			$http({
				method  : 'GET',
				url     : '/api/me',
			}).then(function(returnData){
	            console.log('user info', returnData)
	            if (returnData.data.user) {
	            	console.log('user name', returnData.data.user.username)
	            	$scope.userNAME = returnData.data.user.username
	                $scope.noUser = false;
	                $scope.ifUser = true;
	                //redirect to profile page here
	                // window.location.href = '/api/profiles/'+$scope.userNAME
	            } else {
	            	console.log('no user found')
	            	//no user so stay on page
	            }
	        })
		}
		initial()// has to run on load because reasons????

		$scope.logIn = function(){
			var user = {
				username: $scope.user.username,
				password: $scope.user.password,
			}
			if(user.username && user.password){
				// console.log('sending user info to be validated')
				$http.post('/api/logIn', user).then(function(returnData){
					console.log('return data?', returnData)
					if(!returnData.data.user){
						console.log('no user data retrieved')
						//triger warning that no user was found
						$scope.invalid = "Please enter a valid Username or Password"
						$scope.user.username = ''
						$scope.user.password = ''
					}else {
						$scope.invalid = ''
						$scope.display = returnData.data
						$scope.ifUser = true;
					}
				})
			} else {
				console.log('no info in user page')
				$scope.invalid = "Please enter a valid Username or Password"
				$scope.user.username = ''
				$scope.user.password = ''
			}
		}

		$scope.logOut = function(){
				console.log('trying to log out')
			$http.get('/api/logOut').then(function(){
				$scope.ifUser = false
			})
		}


	}])

app.controller('adminController', ['$scope', '$http', function($scope, $http){
	$scope.feed = []

	console.log('admin controller')
	$http({
		method  : 'GET',
		url     : '/api/me',
	}).then(function(returnData){
		if(!returnData.data.user){
			window.location.href = '/'
		} else if(returnData.data.user.admin === false){
			window.location.href = '/'
		} else {
			//do nothing
		}
	})

	$http.get('/api/getFlaggedPosts/').then(function(returnData){
		$scope.feed = returnData.data
	})

	$scope.deletePost = function(index){
		console.log('deleting a post')
		$http.post('/api/deletePost/', $scope.feed[index]).then(function(returnData){
			console.log(returnData)
		})
		//hide post that was just deleted
	}

	$scope.unflagPost = function(index){
		console.log('unflag a post')
		$scope.feed[index].flagged = false
		$http.post('/api/unflagPost/', $scope.feed[index]).then(function(returnData){
			console.log(returnData)
		})
	}







}])

app.controller('anonController', ['$scope', '$http', function($scope, $http){

	$scope.feed = []

			//automatically gets posts in the feed
			$http.get('/api/getposts').then(function(returnData){
				$scope.feed = returnData.data
				// console.log($scope.feed)
			})

		

		$scope.filter = function(num){
			console.log('setting filter')
			for(var i = 0; i < $scope.feed.length; i++){
				if(num === 0){
					$scope.feed[i].visible = true
				} else if($scope.feed[i].type !== num){
					//hide unwanted posts
					$scope.feed[i].visible = false
				} else {
					$scope.feed[i].visible = true
				}
			}
		}

		$scope.search = function(){
			console.log($scope.searchword)
			for(var i = 0; i < $scope.feed.length; i++){
				//find all posts associated with the searchword
			}
		}

}])




































