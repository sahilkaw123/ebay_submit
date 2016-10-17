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
		            
		            
		            
		            
				}
				var T_Price = Qty*Price;
				var addUser = "INSERT INTO cart (ITEM_CODE, ITEM_NAME, ITEM_DESC, QUANTITY, SELLER_USERNAME, BUYER_USERNAME, TOTAL_PRICE ,PRICE) VALUES" +
			    "('" + id + "','"+ name +"','" + desc +"','" + Qty +"','" + S_Usrname +"','" + B_Usrname +"','"+ T_Price +"','" + Price +"');";
				 
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
						json_responses = {"statusCode" : 200};
						res.send(json_responses);
						   }
					
					},addUser);	
			}
			} 
		},getDetails);
};

//render the cart page
exports.displayCartPage = function(req,res){
	res.render('cart');
};
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

//render the credit card page
/*
exports.placeOrder = function(req,res){
	res.render('placeOrder');
};
*/

exports.placeOrder = function(req,res){
	if(req.session.username)
	{
		console.log(" I m not here12");
		win_logger.log('info', 'user - '+req.session.username+' - redirecting to Order page');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('placeOrder');

	}

};
//render page

//
exports.confirmOrder = function(req,res){
console.log(" I m not here11");

//Checks before redirecting whether the session is valid
console.log(req.session.username);
if(req.session.username)
{
	console.log(" I m not here12");
	win_logger.log('info', 'user - '+req.session.username+' - redirecting to Order page');
	//Set these headers to notify the browser not to maintain any cache for the page being loaded
	res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
	res.render('order',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
	
}

};
/*
exports.confirmOrder = function(req,res){
	res.render('order');
}; */
//Display products to the shopping Cart
exports.getCreditCardDetails = function(req,res){
	var Username = req.session.username;
	
	var getNameDetails = "select FIRSTNAME,LASTNAME from user where USERNAME ='" + Username +"';";
	mysql.fetchData(function(err2,results2){
		if(err2){
			throw err;
		}
		else 
		{		
			
			console.log("Name Fetched Successfully." + "\n");
			console.log( results2);
			 // returing the JSON code to the Angular
			var jsonString = JSON.stringify(results2);
			var jsonParse = JSON.parse(jsonString);
			win_logger.log('info', 'user - '+req.session.username+' - fetching credit card details');
			var newres = {"jsonParse": jsonParse,"rowcount":results2.length};
			console.log("F"+ newres.FIRSTNAME+"L" +  newres.LASTNAME );
			res.send(newres);
			   }
		
		},getNameDetails);
};



//
exports.confirmPage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid

		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - redirecting to confirmation page');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("placeOrder",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname,email:req.session.email});
		

};


//
/*
exports.updateMoney = function(req,res){
	var username = req.session.username;
	var output = " ";
    var amount = " ";
    var name = " ";
	
	var sellerMoney = "select SUM(TOTAL_PRICE) as total, SELLER_USERNAME from cart where BUYER_USERNAME = '" + username+"' group by (Seller_Username);";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Query is Successful." + "\n");
				console.log(results);
				
				for (var i in results) {
		            output = results[i];
		            amount = output.total;
		            name = output.SELLER_USERNAME;
		            console.log(amount);
		            console.log(name);
		            
		      var updatePrice = "update user set balance = balance +" + amount + " where USERNAME ='"+ name+"';";      
				
				
				
			 //sql query to distribute the share of the prices 
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{		
						
						console.log("Data  -- Successfully." + "\n");
						console.log( results1);
						   }
					
					},updatePrice);	
				}}
			} 
		},sellerMoney);
}; */

//

exports.updateMoney = function(req,res){
	var username = req.session.username;
	var output = " ";
    var amount = " ";
    var name = " ";
    var output1 = "";
    var Code = "";
    var Qty = "";
    var output4 = "";
	var Amt = "";
	var output2 = "";
	var json_responses;
	var sellerMoney = "select SUM(TOTAL_PRICE) as total, SELLER_USERNAME from cart where BUYER_USERNAME = '" + username+"' group by (Seller_Username);";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Query is Successful." + "\n");
				console.log(results);
				
				for (var i in results) {
		            output = results[i];
		            amount = output.total;
		            name = output.SELLER_USERNAME;
		            console.log(amount);
		            console.log(name);
		            
		      var updatePrice = "update user set balance = balance +" + amount + " where USERNAME ='"+ name+"';";      
			 //sql query to distribute the share of the prices 
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{
						console.log("Data *** Successfully." + "\n");
						var getQty = "select ITEM_CODE, QUANTITY from cart where BUYER_USERNAME = '" + username+"';";
						
						console.log("Data  -- Successfully." + "\n");
						console.log( results1);
						mysql.fetchData(function(err,results2){
							if(err){
								throw err;
							}
							else 
							{
								if(results2.length > 0){
									console.log("Query5 is Successful." + "\n");
									console.log(results);
									
									for (var i in results2) {
							            output2 = results2[i];
							            Code = output2.ITEM_CODE;
							            Qty = output2.QUANTITY ;
							            console.log(Code);
							            console.log(Qty);
							            var updateQty = "update product set ITEM_QTY = ITEM_QTY - " + Qty + " where ITEM_CODE ='"+ Code+"';";  		            
							            
							            mysql.fetchData(function(err3,results3){
											if(err3){
												throw err;
											}
											else 
											{		
												
												console.log("Data --->> Successfully." + "\n");
												console.log( results3);
												var updateBuyer = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + username +"';";
												 mysql.fetchData(function(err4,results4){
														if(err4){
															throw err;
														}
														else 
														{
															console.log("result4 is successful" );
															console.log(results4);
															//for (var i in results4){
																output4 = results4;
																Amt = output4[0].cart_Price;
																console.log("xxx"+ Amt);
															//}
																var updtUBal = "update user set Balance = Balance - " + Amt +" " + " where USERNAME ='" + username +"';";
																
																
																mysql.fetchData(function(err5,results5){
																	if(err5){
																		throw err;
																	}
																	else 
																	{	
																		var updtOrdr = "INSERT INTO ORDERS (ORDERID, ITEM_NAME, ITEM_DESC ,QUANTITY ,INDIVIDUAL_PRICE," +
																		"Buyer_Username, Seller_USERNAME, TOTAL_PRICE,bid) Select ITEM_CODE,ITEM_NAME, ITEM_DESC ,QUANTITY,PRICE,Buyer_USERNAME,Seller_Username, Total_Price,bid from cart where BUYER_USERNAME ='" + username +"';";
																		console.log("results5 is successful" );
																		console.log("Query is" + updtOrdr)
																		console.log(results5);
																		//Copying shopping cart to Order table for record and deleting the shopping cart table.
																		mysql.fetchData(function(err6,results6){
																			if(err5){
																				throw err;
																			}
																			else 
																			{	
																				console.log("result6 is successful" );
																				console.log(results6);
																				
																				var delCart = "delete from cart where Buyer_Username ='" + username +"';";
																				console.log("Query is" + delCart)
																				
																				mysql.fetchData(function(err7,results7){
																					if(err5){
																						throw err;
																					}
																					else 
																					{	
																						console.log("result7 is successful" );
																						console.log(results7);
																						win_logger.log('info', 'user - '+req.session.username+' - updating the qty, money fron buyer and user');
																						json_responses = {"statusCode" : 200};
																						res.send(json_responses);
																					}
																				},delCart);
																			}	
																		},updtOrdr);
																	}
																},updtUBal);	
														}
												 },updateBuyer);
												   }
											},updateQty);	    
									}}}
						},getQty);
								}		
					},updatePrice);	
				}}
			} 
		},sellerMoney);
};


//

/*
exports.updateMoney = function(req,res){
	var username = req.session.username;
	var output = " ";
    var amount = " ";
    var name = " ";
    var output1 = "";
    var Code = "";
    var Qty = "";
    var output4 = "";
	var Amt = "";
	var output2 = "";
    
	var sellerMoney = "select SUM(TOTAL_PRICE) as total, SELLER_USERNAME from cart where BUYER_USERNAME = '" + username+"' group by (Seller_Username);";
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("Query is Successful." + "\n");
				console.log(results);
				
				for (var i in results) {
		            output = results[i];
		            amount = output.total;
		            name = output.SELLER_USERNAME;
		            console.log(amount);
		            console.log(name);
		            
		      var updatePrice = "update user set balance = balance +" + amount + " where USERNAME ='"+ name+"';";      
			 //sql query to distribute the share of the prices 
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{
						console.log("Data *** Successfully." + "\n");
						var getQty = "select ITEM_CODE, QUANTITY from cart where BUYER_USERNAME = '" + username+"';";
						
						console.log("Data  -- Successfully." + "\n");
						console.log( results1);
						mysql.fetchData(function(err,results2){
							if(err){
								throw err;
							}
							else 
							{
								if(results2.length > 0){
									console.log("Query5 is Successful." + "\n");
									console.log(results);
									
									for (var i in results2) {
							            output2 = results2[i];
							            Code = output2.ITEM_CODE;
							            Qty = output2.QUANTITY ;
							            console.log(Code);
							            console.log(Qty);
							            var updateQty = "update product set ITEM_QTY = ITEM_QTY - " + Qty + " where ITEM_CODE ='"+ Code+"';";  		            
							            
							            mysql.fetchData(function(err3,results3){
											if(err3){
												throw err;
											}
											else 
											{		
												
												console.log("Data --->> Successfully." + "\n");
												console.log( results3);
												var updateBuyer = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + username +"';";
												 mysql.fetchData(function(err4,results4){
														if(err4){
															throw err;
														}
														else 
														{
															console.log("result4 is successful" );
															console.log(results4);
															//for (var i in results4){
																output4 = results4;
																Amt = output4[0].cart_Price;
																console.log("xxx"+ Amt);
															//}
																var updtUBal = "update user set Balance = Balance - " + Amt +" " + " where USERNAME ='" + username +"';";
																
																
																mysql.fetchData(function(err5,results5){
																	if(err5){
																		throw err;
																	}
																	else 
																	{		
																		console.log("results5 is successful" );
																		console.log(results5);
																	}
																},updtUBal);
															
														}
												
												 },updateBuyer);
												   }
											
											},updateQty);	
							            
							            
							            
									}}}
						
						},getQty);
								}		
						
					
					},updatePrice);	
				}}
			} 
		},sellerMoney);
};



*/


exports.checkOutProducts = function(req,res){
	var Username = req.session.username;
	
	var output1 = "";
    var cart_price = "";
	
	var getProduct = "select ITEM_CODE,ITEM_NAME,ITEM_DESC,QUANTITY,SELLER_USERNAME,BUYER_USERNAME,PRICE,PIC," +
			"cart_id,TOTAL_PRICE from cart where BUYER_USERNAME ='" + Username +"';";
	
	var cartPrice = "SELECT SUM(TOTAL_PRICE) as cart_Price FROM cart where BUYER_USERNAME ='" + Username +"';";
	
	
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
				
				/*for (var i in results) {
		            
		           output1 += results[i].TOTAL_PRICE;
		            
		            
				}
				var x = output1;
				console.log("acd"+ x); */
				
				
			 //sql query to display shopping cart
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err;
					}
					else 
					{		
						
						console.log("Data  Successfully." + "\n");
						console.log( results1);
						 // returing the JSON code to the Angular
						var jsonString = JSON.stringify(results);
						var jsonParse = JSON.parse(jsonString);
						win_logger.log('info', 'user - '+req.session.username+' - checkOut successful');
						var newres = {"jsonParse": jsonParse,"rowcount":results.length,"cart_Price":results1};
						console.log("xxx"+ newres.cart_Price);
						res.send(newres);
						   }
					
					},cartPrice);	
			}
			} 
		},getProduct);
};

