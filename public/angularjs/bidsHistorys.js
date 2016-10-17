var app = angular.module("bidH", []);

app.controller('bidHController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/historyProduct",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult = response.jsonParse;
			$scope.ROW_COUNT= response.rowcount;
			$scope.date = response.date1;
			$scope.time = response.time1;
			console.log($scope.newResult);
			console.log($scope.BID_PRICE);
		});
	
};
});

//$scope.placeBid = function(ITEMCODE, BidP){
