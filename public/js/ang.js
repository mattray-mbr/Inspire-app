var app = angular.module('inspire', [])
//single module for app
	app.controller('mainController', ['$scope', '$http', function($scope, $http){
		var s = $scope

		s.greeting = "hello"
		// var person = {
		// 	name: s.user.name,
		// 	email: s.user.email,
		// 	message: s.user.message,
		// }


		s.addStuff = function(){
			$http.post('/more', person).then(function(returnData){
				$scope.display = returnData.data
			})
			
		}



	}])