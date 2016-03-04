var app = angular.module('inspire', [])
//single module for app
	app.controller('mainController', ['$scope', '$http', function($scope, $http){
		var s = $scope

		s.greeting = "hello"
		


		s.addStuff = function(){
			var person = {
			username: s.user.name,
			email: s.user.email,
			password: s.user.password,
		}
			$http.post('/api/userBase', person).then(function(returnData){
				$scope.display = returnData.data
			})
			
		}



	}])