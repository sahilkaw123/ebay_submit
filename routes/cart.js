var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mysql = require('./mysql'); // without using pool

var win_logger = require('winston');
// to validate  the login user signin function 
/*
  
 exports.checksignin = function(req,res){
	
	
	
	var username = req.param('username');
	var password = req.param('password');
	
	var json_responses;
	
	if((username!=='') && (password !=='')){
		var getUser = "select * from user where username='" + username +
						"'" + "or email='" + username +"' and password='" + password +"'";
		console.log("Query is :" +getUser);
	
	
	mysql.fetchData(function (err, results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("Credentials accepted ");
				req.session.destroy();
				var username = results[0].USERNAME;
				
				var firstname1 = results[0].FIRSTNAME;
				var firstname = firstname1.toUpperCase(); 
				var lastname1 = results[0].LASTNAME;
				var lastname = lastname1.toUpperCase();
				req.session.username = username; // To assign the session to the user
				req.session.firstname = firstname;// To assign the session to the firstname
				req.session.lastname = lastname;// To assign the session to the firstname
				console.log("Session Initialized");
				console.log(results);
				console.log(req.session.username);
				console.log(req.session.firstname);
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}
			else{
				console.log("Invalid Credentials");
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
				
			}
		}	
		},getUser);
	}
	else{
		json_responses={"statusCode" : 401};
		res.send(json_responses);
	}
};//login function ends 

//rendering to signin page of ebay 

exports.signin = function(req,res){
	res.render('signin');
};




//HomePage redirection

//Redirects to the homepage
exports.redirectToHomepage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}
	else
	{
		res.redirect('/signin');
	}
};

//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	res.redirect('/');
};


//Signup

exports.signup = function(req,res) {

	ejs.renderFile('./views/signup.ejs', function(err, result) {
	   // render on success
	   if (!err) {
	            res.end(result);
	   }
	   // render or error
	   else {
	            res.end('An error occurred');
	            console.log(err);
	   }
   });
};
*/
// Add Products to shopping cart
exports.addProducts = function(req,res)
{
	// check user already exists
	var B_Usrname = req.session.username;
	var id = req.param('item_id');
	var Qty = req.param('Qty');
	var json_responses;
	
	var output = " ";
    var name = " ";
    var desc = " ";
    var Qty1 = " ";
    var S_Usrname =" ";
    var Price = " ";
	
	//query to check if the item is already added to the user 
	//var checkItem="select * from cart where ITEM_CODE='"+ id + "'" + "AND BUYER_USERNAME='" + username+"';" ;
	
	var getDetails="select * from product where ITEM_CODE='"+ id + "'"; 
	
	
	//console.log("Query is:"+checkItem);
	console.log("Query is:"+getDetails);
	//console.log("Query is:"+addUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Data Fetched Successfully." + "\n");
				console.log(results);
				
				for (var i in results) {
		            output = results[i];
		            name = output.ITEM_NAME;
		            desc = output.ITEM_DESC;
		            Qty1 = output.ITEM_QTY;
		            S_Usrname = output.SELLER_USERNAME;
		            Price = output.ITEM_PRICE;
		            Bid = output.BID;
		            pic = output.pic;
		            
		            
				}
				var T_Price = Qty*Price;
				var addUser = "INSERT INTO cart (ITEM_CODE, ITEM_NAME, ITEM_DESC, QUANTITY, SELLER_USERNAME, BUYER_USERNAME, TOTAL_PRICE ,PRICE,PIC, bid) VALUES" +
			    "('" + id + "','"+ name +"','" + desc +"','" + Qty +"','" + S_Usrname +"','" + B_Usrname +"','"+ T_Price +"','" + Price +"','" + pic + "','" + Bid +"');";
				 
				console.log("test"+output);
			    //sql query to insert the values in the  cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{					
						console.log("Data Inserted Successfully." + "\n");
						 // returing the JSON code to the Angular
						win_logger.log('info', 'user - '+req.session.username+' - product addedd successfully to cart');
						json_responses = {"statusCode" : 200};
						res.send(json_responses);
						   }
					
					},addUser);	
			}
			} 
		},getDetails);
};

//render the cart page

//Display products to the shopping Cart
/*
exports.displayProducts = function(req,res){
	var Username = req.session.username;
	
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE,SUM(TOTAL_PRICE) as Cart_Price from cart where BUYER_USERNAME ='" + Username +"';";
	
	var cartPrice = "SELECT SUM(TOTAL_PRICE) as total_mark FROM cart where BUYER_USERNAME ='" + Username +"';";
	
	console.log("Select Query "+ getProduct);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				res.send(newres);
			}
			else{
				console.log("No reords in the database");
			}
		}
	},getProduct);
};		
*/
exports.displayCartPage = function(req,res){
	console.log(" I m not here11");
		
		//Checks before redirecting whether the session is valid
		console.log(req.session.username);
		if(req.session.username)
		{
			console.log(" I m not here12");
			win_logger.log('info', 'user - '+req.session.username+' - redirecting to cart page');
			//Set these headers to notify the browser not to maintain any cache for the page being loaded
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render('cart',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
			
		}
		
	};
/*
exports.displayCartPage = function(req,res){
	res.render('cart');
};
*/
//Display products to the shopping Cart

exports.removeProducts = function(req,res){
	var id = req.param('id');
	console.log("id"+ id);
	var myResult = "Delete from cart where ITEM_CODE ='" + id +"';" ;
	console.log("Query is:" + myResult);
var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				console.log("I am here444");
			win_logger.log('info', 'user - '+req.session.username+' - removing from cart');
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
				//res.send(newres);
			
			
		}
	},myResult);
};

/*
exports.displayProducts = function(req,res){
	var Username = req.session.username;
	
	var output1 = "";
    var cart_price = "";
	
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE from cart where BUYER_USERNAME ='" + Username +"';";
	
	
	
	console.log("Select Query "+ getProduct);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Data Fetched Successfully." + "\n");
				console.log(results);
				
				
				var cartPrice = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + Username +"';";
			 //sql query to display shopping cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{		
						
						console.log("Data tucked Successfully." + "\n");
						console.log( results1);
						 // returing the JSON code to the Angular
						var jsonString = JSON.stringify(results);
						var jsonParse = JSON.parse(jsonString);
						var newres = {"jsonParse": jsonParse,"rowcount":results.length,"cart_Price":results1};
						console.log(newres.cart_Price);
						res.send(newres);
						   }
					
					},cartPrice);	
			}
			} 
		},getProduct);
}; */

exports.displayProducts = function(req,res){
	var Username = req.session.username;
	
	var output1 = "";
    var cart_price = "";
	
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE from cart where BUYER_USERNAME ='" + Username +"';";
	
	
	
	console.log("Select Query "+ getProduct);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Data Fetched Successfully." + "\n");
				console.log(results);
				
				
				var cartPrice = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + Username +"';";
			 //sql query to display shopping cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{		
						
						console.log("Data tucked Successfully." + "\n");
						console.log( results1);
						 // returing the JSON code to the Angular
						
						var cartCount = "SELECT SUM(QUANTITY) as QTYC FROM cart where BUYER_USERNAME ='" + Username +"';";
						mysql.fetchData(function(err2,results2){
							if(err1){
								throw err;
							}
							else 
							{	
								console.log( "QTYC"+ results2[0].QTYC);
								var QTYC = results2[0].QTYC;
								req.session.QTYC = QTYC;
								console.log(QTYC);
								var jsonString = JSON.stringify(results);
								var jsonParse = JSON.parse(jsonString);
								win_logger.log('info', 'user - '+req.session.username+' - displaying total product and total price');
								var newres = {"jsonParse": jsonParse,"rowcount":results.length,"cart_Price":results1,"QTYC":results2};
								console.log(newres.cart_Price);
								res.send(newres);
							}
						},cartCount);
						
						   }
					
					},cartPrice);	
			}
			} 
		},getProduct);
};
