var app = angular.module("profile", []);

app.controller('profController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/profileDetail",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult1 = response.jsonParse;
			$scope.newResult2 = response.jsonParse1;
			$scope.newResult3 = response.jsonParse2;
			$scope.newResult4 = response.jsonParse3;
			$scope.newResult5 = response.jsonParse4;
			$scope.newResult6 = response.jsonParse5;
			$scope.newResult7 = response.jsonParse6;
			$scope.ROW_COUNT1= response.rowcount;
			$scope.ROW_COUNT2= response.rowcount1;
			$scope.ROW_COUNT3= response.rowcount2;
			$scope.ROW_COUNT4= response.rowcount3;
			$scope.ROW_COUNT5= response.rowcount4;
			$scope.ROW_COUNT6= response.rowcount5;
			$scope.ROW_COUNT7= response.rowcount6;
			//$scope.BID_PRICE = response.jsonMaxP[0].M_Price;
			console.log($scope.ROW_COUNT1);
			console.log($scope.ROW_COUNT2);
			//console.log($scope.BID_PRICE);
		});
	
}; 

//$scope.placeBid = function(ITEMCODE, BidP){
$scope.profile = function(username){
	$scope.value = username;
	console.log($scope.value);
		
		$http({
			method :"POST",
			url : "/fetchProfile",
			data : {
				username : $scope.value
				
			}
		}).success(function(response){
			 window.location.assign('/person');
			
			
		});
	
}; 

//change cart to directbuy page
$scope.buyNow = function(ITEMCODE, Qty){
	$scope.value = ITEMCODE;
	console.log($scope.value);
		
		$http({
			method :"POST",
			url : "/buyProducts",
			data : {
				item_id : $scope.value
			}
		}).success(function(data){
			if (data.statusCode == 200) {
                window.location.assign('/cart');
			}
			}).error(function (err) {
				
			});
	}
})


