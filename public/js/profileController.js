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
		
		//depricated for now
		$scope.savePost1 = function(index){
			console.log('saving post to user archieves')
			$scope.feed[index].archieved.push(userNAME)
			console.log($scope.feed[index].archieved)
			$http.post('/api/saveArchieve/', $scope.feed[index]).then(function(returnData){
				$scope.feed[index] = returnData.data
				isArchieved()
			})
			
		}


	}])