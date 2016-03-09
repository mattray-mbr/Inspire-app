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
			controller  : 'mainController'
		})
		.when('/profiles/:userID', {
			templateUrl : '/html/profile.html',
			controller  : 'profileController'
		})
		.when('/categories', {
			templateUrl : '/html/categories.html',
			controller  : 'mainController'
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
		initial()//running function automatically when page loads

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

		function sendProfile(){
			console.log('userId', $scope.userID)
			$http.get('/api/profiles/'+ $scope.userID).then(function(returnData){
				console.log('redirecting')
			})
		}



	}])

	app.controller('profileController', ['$scope', '$http', function($scope, $http){

		$scope.feed = []

		//get data about the current user logged in
		$http({
				method  : 'GET',
				url     : '/api/me',
			}).then(function(returnData){
	            console.log('user info', returnData)
	            $scope.loggedInUser = returnData.data
	            $scope.loggedInUsername = $scope.loggedInUser.user.username
	        })


			//automatically gets posts in the feed
			$http.get('/api/getposts').then(function(returnData){
				$scope.feed = returnData.data
				
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

		 

	}])


	app.controller('headerController', ['$scope', '$http', function($scope, $http){

		$scope.ifUser = false;
		$scope.user = {} //!important! needs to initialize as an empty objects in order to bind values to it

		$scope.logIn = function(){
			var user = {
				username: $scope.user.username,
				password: $scope.user.password,
			}
			$http.post('/api/logIn', user).then(function(returnData){
				$scope.display = returnData.data
				$scope.ifUser = true;
			})
		}

		$scope.logOut = function(){
				console.log('trying to log out')
			$http.get('/api/logOut').then(function(){
				$scope.ifUser = false
			})
		}


	}])



































