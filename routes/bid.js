var ejs = require("ejs");
var mysql = require('./mysql');

var win_logger = require('winston');

exports.bidProduct = function (req,res){
	
	
	var id = req.session.id;
	 
	console.log(req.session.id);
	//var myResult = "Select * from product where ITEM_CODE IN('" + 3 +"'" + ",'" + 7 +"'" +",'"+ 4 +"');" ;
	var timeChk = "Select * from bidCheck where tme> CUrrent_Timestamp and ITEM_CODE ='" + id +"';" ;
	var maxBidP = "Select max(PRICE_BID) as M_Price from bid where ITEM_CODE ='" + id +"';" ;
	var myResult = "Select A.ITEM_CODE,A.ITEM_NAME, A.category, A.ITEM_DESC,A.COND,A.MIN_PRICE,A.SELLER_USERNAME,B.PRICE_BID,A.pic from PRODUCT A, BID B where A.ITEM_CODE = B.ITEM_CODE AND A.ITEM_CODE ='" + id +"';" ;
	console.log("Query is:" + myResult);
	//var json_responses;
	
	
	//check if 4 days have passed or not
	mysql.fetchData(function(err2,results2){
		if(err2){
			throw err2;
		}
		else{
			if(results2.length > 0){
				win_logger.log('info', 'user - '+req.session.username+' - checking if bid time is still valid');
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else{
						// fetch product details from page
						if(results.length > 0){
							var jsonString = JSON.stringify(results);
							var jsonParse = JSON.parse(jsonString);
							//var newres = {"jsonParse": jsonParse,"rowcount":results.length};
							console.log("DONE123");
							console.log("result" +results.length);
							console.log("result" +jsonParse);
							win_logger.log('info', 'user - '+req.session.username+' - finding details of bidding');
							//json_responses = {"statusCode" : 200};
							//res.send(json_responses);
							//res.send(newres);
							// if successful
							
							mysql.fetchData(function(err1,results1){
								if(err1){
									throw err1;
								}
								else{
									var jsonString1 = JSON.stringify(results1);
									var jsonMaxP1 = JSON.parse(jsonString1);
									var jsonMaxP = jsonMaxP1[0].M_Price;
									console.log("NOTDONE123");
									console.log("result" +results1.length);
									console.log("result" +jsonMaxP1);
									var newres = {"jsonParse": jsonParse,"rowcount":results.length,"jsonMaxP":results1};
									console.log("123"+ newres.jsonMaxP);
									//json_responses = {"statusCode" : 200};
									//res.send(json_responses);
									win_logger.log('info', 'user - '+req.session.username+' - finding maximum bid');
									res.send(newres);
								}
							},maxBidP);
							
						}
						else{
							console.log("No reords in the database");
							win_logger.log('info', 'user - '+req.session.username+' - No record in database');
						}
					}
				},myResult);
				
				
			}
			else {
				ejs.renderFile('./views/successbid.ejs',function(err, result) {
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
			}
		}
		
	},timeChk);
	
};		


	
	
	
exports.bidPage = function(req, res){
	
		console.log(" I m not here11");
		
		//Checks before redirecting whether the session is valid
		console.log(req.session.username);
		if(req.session.username)
		{
			console.log(" I m not here12");
			win_logger.log('info', 'user - '+req.session.username+' - redirect to bidding page');
			//Set these headers to notify the browser not to maintain any cache for the page being loaded
			res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
			res.render('bid',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
			
		}
};

exports.confirmBidPage = function(req, res){
	
	console.log(" I m not here11");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		console.log(" I m not here12");
		win_logger.log('info', 'user - '+req.session.username+' - redirect to update bidding amount');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('bidSuccess',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}
};

//bid History Page

//
exports.bidCmp = function (req,res){
	var output = " ";
    var Code = " ";
    var name = " ";
    var desc = " ";
	var x = " ";
	//console.log(req.session.id);
	//console.log(req.session.username);
	var id = req.param('id');
	req.session.id = id;
	var bidP = req.param('bidP');
	console.log(bidP);
	var username = req.session.username;
	var ITEM_NAME = req.param('ITEM_NAME');
	var ITEM_DESC = req.param('ITEM_DESC');
	
	console.log("I am bidding good");
	console.log(id);
	//var myResult = "Select * from product where ITEM_CODE IN('" + 3 +"'" + ",'" + 7 +"'" +",'"+ 4 +"');" ;
	var timeChk = "Select * from bidCheck where tme > Current_Timestamp and ITEM_CODE ='" + id +"';" ;
	//var bidValid = "Select * from bidCheck where tme > current_timestamp and ITEM_CODE ='" + id +"';" ;
	var myResult = "Select * from product where ITEM_CODE ='" + id +"';" ;
	var maxBidP = "Select max(PRICE_BID) as M_Price from bid where ITEM_CODE ='" + id +"';" ;
	//console.log("Query is:" + bidValid);
	console.log("Query is:" + timeChk);
	var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("Still time for bidding");
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err1;
					}
					else{
						var jsonString = JSON.stringify(results1);
						var jsonParse = JSON.parse(jsonString);
						var newres = {"jsonParse": jsonParse,"rowcount":results1.length};
						console.log("result" +results1.length);
						console.log("result" +jsonParse);
						x = results1[0].M_Price;
						console.log("Bid" + bidP);
						console.log("Max_P"+ x);
						if(bidP > x){
							
							mysql.fetchData(function(err2,results2){
								if(err1){
									throw err1;
								}
								else{
									output = results2[0];
						            Code = output.ITEM_CODE;
						            name = output.ITEM_NAME;
						            desc = output.ITEM_DESC;
						            console.log(Code);
						            console.log(name);
						            console.log(desc);
									win_logger.log('info', 'user - '+req.session.username+' - bidding price is compared and is greater than present bid');
						            var addBid = "INSERT INTO bid (ITEM_CODE, ITEM_NAME, ITEM_DESC, PRICE_BID, BUYER_USERNAME) VALUES" + 
						            "('" + id + "','"+ name +"','" + desc +"','" + bidP +"','" + username  +"');";
						           
						            
						            
						            mysql.fetchData(function(err3,results3){
						            	if(err1){
											throw err1;
										}
										else{
											console.log("Bid entered successfully");
											win_logger.log('info', 'user - '+req.session.username+' - Bid data entered suceefully');
											json_responses = {"statusCode" : 200};
											res.send(json_responses);
										}
						            	
						            },addBid);
								
								
								
								}
							},myResult);
						}
						else{
							console.log("The bid is less than current price")
							win_logger.log('info', 'user - '+req.session.username+' - Bidding amount less than max bidded price');
							json_responses = {"statusCode" : 401};
							res.send(json_responses);
							
						}
					}
				},maxBidP);
			}
			else{
				console.log("Bidding Time ends");
				win_logger.log('info', 'user - '+req.session.username+' - Bidding time not valid');
			}
		}
		
	},timeChk);
};
		
exports.bidHistory = function(req, res){


	
		console.log(" I m not at all here12");
	win_logger.log('info', 'user - '+req.session.username+' - redirecting to bidding history on the product');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('bidHistory',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	
};
//
exports.historyProduct = function (req,res){
	var id  = req.session.id;
	var json_responses;
	var TotalBids = "Select * from bid where Buyer_Username is not null and ITEM_CODE ='" + id +"';" ;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length >= 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				
				var dateTime = results[0].bid_timestamp;
				var d = new Date(dateTime);
				var dateT = d.toString();
				console.log(dateT);
				
				var date1 = dateT.substring(0, 15);
				console.log(date1);
				req.session.date = date1;
				var time1 = dateT.substring(16, 24);
				console.log(time1);
				win_logger.log('info', 'user - '+req.session.username+' - fetching bidding history');
				console.log("NOTDONE123");
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length,"date1":date1,"time1":time1};
				res.send(newres);
			}
				
	}
	},TotalBids);	
};
			
//
exports.bidTimeFetch = function (req,res){
	var id  = req.session.id;
	var json_responses;
	var TotalBids = "Select * from bidCheck where ITEM_CODE ='" + id +"';" ;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			if(results.length >= 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				
				var dateTime = results[0].tme;
				console.log()
				var d = new Date(dateTime);
				var dateT = d.toString();
				console.log(dateT);
				
				var date1 = dateT.substring(0, 15);
				console.log(date1);
				req.session.date = date1;
				var time1 = dateT.substring(16, 24);
				console.log(time1);
				win_logger.log('info', 'user - '+req.session.username+' - fetching bidding timestamp');
				console.log("NOTDONE123");
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length,"date1":date1,"time1":time1};
				res.send(newres);
			}
				
	}
	},TotalBids);	
};
		


//
//
exports.bidHistoryProd = function (req,res){
var id = req.param('id');
req.session.id = id;
var username = req.session.username;
var json_responses;
var noOfBids = "Select * from bid where Buyer_Username is not null and ITEM_CODE ='" + id +"';" ;
mysql.fetchData(function(err,results){
	if(err){
		throw err;
	}
	else{
		if(results.length >= 0){
			win_logger.log('info', 'user - '+req.session.username+' - bidding history - no of bids');
			json_responses = {"statusCode" : 200};
			res.send(json_responses);
		}
			
}
},noOfBids);	
};
		
		
		
/*		
		
	}
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("Still time for bidding");
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err1;
					}
					else{
						if(results.length > 0){
							
						}
							
				
				
			}
			else{
				
				ejs.renderFile('./views/successbid.ejs',function(err, result) {
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
				
				
			}
		}
			
				
			
	},timeChk); 

};		

*/
