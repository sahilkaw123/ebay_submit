var app = angular.module("bidT", []);

app.controller('bidTController',function ($scope, $http){ 
	
	//$scope.Now = function(ITEMCODE){
	//	$scope.value = ITEMCODE;
	//	console.log($scope.value);
	window.onload = function(){
		
		$http({
			method :"GET",
			url : "/bidTimeFetch",
			data : {
				
			}
		}).success(function(response){
			$scope.newResult = response.jsonParse;
			$scope.ROW_COUNT= response.rowcount;
			$scope.date = response.date1;
			$scope.time = response.time1;
			console.log("I am here");
			console.log($scope.date);
			console.log($scope.time);
		});
	
};
}); 

