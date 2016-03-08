var app = angular.module('inspire', ['ngRoute'])

app.config(function($routeProvider){
	$routeProvider
		.when('/', {
			templateUrl : '/html/index.html',
			controller  : 'mainController'
		})
		.when('/about', {
			templateUrl : '/html/about.html',
			controller  : 'mainController'
		})
})
//single module for app
	app.controller('mainController', ['$scope', '$http', function($scope, $http){
		//initial declarations
		var s = $scope
		s.greeting = "Title"

		//initial request to see if any user is logged in
		function initial(){	 //put inside a function so that I can call it on login button
			$http({
				method  : 'GET',
				url     : '/api/me',
			}).then(function(returnData){
	            console.log('user info', returnData)
	            if (returnData.data.user) {
	            	console.log('user id', returnData.data.user._id)
	            	s.userID = returnData.data.user._id
	                // s.loggedIn = true
	                // s.loggedOut = true

	                //redirect to profile page here
	                window.location = '/api/profiles/'+s.userID
	            } else {
	            	console.log('no user found')
	            	//no user so stay on page
	            }
	        })
		}
		initial()//running function automatically when page loads

		s.signUp = function(){
			var person = {
				username: s.newUser.username,
				email: s.newUser.email,
				password: s.newUser.password,
			}
			$http.post('/api/userBase', person).then(function(returnData){
				$scope.display = returnData.data
				s.ifUser = true;
				initial() 
			})
		}

		s.logIn = function(){
			var user = {
				username: s.user.username,
				password: s.user.password,
			}
			$http.post('/api/logIn', user).then(function(returnData){
				s.display = returnData.data
				initial()
			})
			
		}

		function sendProfile(){
			console.log('userId', s.userID)
			$http.get('/api/profiles/'+ s.userID).then(function(returnData){
				console.log('redirecting')
			})
		}



	}])

	app.controller('profileController', ['$scope', '$http', function($scope, $http){



		var userID = window.location.pathname.split('/').pop()
		console.log(userID)
		$http.get('/profiles/' + userID).then(function(serverResponse){
			console.log(serverResponse)
			$scope.loggedInUser = serverResponse.data
		})

		$scope.logOut = function(){
				console.log('trying to log out')
			$http.get('/api/logOut')
		}

		$scope.newPost = function(){
			var post = {
				type      : $scope.post.type,
				message   : $scope.post.message,
			}
			$http.post('/api/newPost', post).then(function(returnData){
				$scope.feed = returnData.data
			})
		}

	}])


































