var app = angular.module("order", []);
    
app.controller('orderController', function ($scope, $http) {

window.onload = function(){
			
			$http({
				method :"GET",
				url : "/checkOutProducts",
				data : {
					
				}
			}).success(function(response){
				$scope.newResult1 = response.jsonParse;
				$scope.rowCount= response.rowcount;
				$scope.Cart_Price = response.cart_Price;
				console.log($scope.newResult1);
				//console.log($scope.Cart_Price);
			});
		
	};



}); // controller ends

/*
$scope.Confirm = function(){
	
	
	$http({
		method :"POST",
		url : "/creditcard",
		data : {
			
		}
	}).success(function(data){
		if (data.statusCode == 200) {
            
			console.log("Its successful");
			window.location.assign('/cart');
		}
		}).error(function (err) {
			
		});
} // scope.Checkout
}); // controller ends
*/