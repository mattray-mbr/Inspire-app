var app = angular.module('inspire', ['ngRoute'])

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

	app.controller('profileController', ['$scope', '$http', function($scope, $http){

		$scope.feed = []
		console.log('profile controller')

		//automatically gets posts in the feed
		$http.get('/api/getposts').then(function(returnData){
			$scope.feed = returnData.data
			// console.log($scope.feed)
		})

		var userNAME = window.location.pathname.split('/').pop()
		$http.get('/profiles/' + userNAME).then(function(serverResponse){
			console.log(serverResponse)
			$scope.loggedInUser = serverResponse.data
		})

		

		$scope.newPost = function(){
			var item = {
				name      : userNAME,
				type      : $scope.post.type,
				message   : $scope.post.message,
			}
			$http.post('/api/newPost', item).then(function(returnData){
				console.log('posting new item')
				$scope.feed.push(returnData.data)
			})
		}

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

		 $scope.archieved = function(){
		 	var userNAME = window.location.pathname.split('/').pop()
			window.location.href = '/api/archieve/'+userNAME
		}

		$scope.archievePost = function(index){
			var userNAME = window.location.pathname.split('/').pop()
			console.log($scope.feed[index])
			$http.post('/api/userArchieves', {username: userNAME, postID: $scope.feed[index]._id}).then(function(returnData){
				console.log('info coming back from archieve update', returnData.data)
			})
		}

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
	}])

	app.controller('archieveController', ['$scope', '$http', function($scope, $http){

		// $http.get('/api/getArchievePosts/'+).then(function(retrunData){
			
		// })
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
}])

app.controller('anonController', ['$scope', '$http', function($scope, $http){

	$scope.feed = []

			//automatically gets posts in the feed
			$http.get('/api/getposts').then(function(returnData){
				$scope.feed = returnData.data
				// console.log($scope.feed)
			})

		// $scope.newPost = function(){
		// 	var item = {
		// 		name      : userNAME,
		// 		type      : $scope.post.type,
		// 		message   : $scope.post.message,
		// 	}
		// 	$http.post('/api/newPost', item).then(function(returnData){
		// 		console.log('posting new item')
		// 		$scope.feed.push(returnData.data)
		// 	})
		// }

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


































