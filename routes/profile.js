var ejs = require("ejs");
var mysql = require('./mysql');
var win_logger = require('winston');

exports.openProfilePage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - Profile page with shopping records');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("profile",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

exports.person = function(req,res)
{
	console.log(" I m not in the here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - Users personal Profile page');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("person",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

};

exports.personDetail = function(req,res){
	var user = req.session.username;
	console.log("username is  "+ user);
	var fetProfile = "Select * from user where Username ='" + user +"';" ;
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
			console.log("result123" +jsonParse);
			console.log("DOB"+ results[0].BirthDay);
			console.log("DOB"+ results[0].PHONE);
			console.log("DOB"+ results[0].Joining);
			console.log("EMAIL"+ results[0].EMAIL);
			var email = results[0].EMAIL;
			req.session.email = email;
			console.log(email);
			console.log("I am the user");
			win_logger.log('info', 'user - '+req.session.username+' - fetching individual details of the user');
			json_responses = {"statusCode" : 200};
			//res.send(json_responses);
			res.send(newres);
		}
	},fetProfile);
};
/*
 
exports.profileDetail = function(req,res){
	var username = req.session.username;
	console.log("username is  "+ username);
	var buyResult = "Select * from orders where Buyer_Username ='" + username +"';" ;
	var sellResult = "Select * from orders where Seller_Username ='" + username +"';" ;
	console.log("Query is:" + buyResult);
	console.log("Query is:" + sellResult);
var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				console.log("I am here444");
				
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err1;
					}
					else{
						var jsonString1 = JSON.stringify(results1);
						var jsonParse1 = JSON.parse(jsonString1);
						var newres = {"jsonParse": jsonParse,"rowcount":results.length,"jsonParse1":jsonParse1,"rowcount1":results1.length};
						console.log("result" +results1.length);
						console.log("result" +jsonParse1);
						console.log("I am here555");
						json_responses = {"statusCode" : 200};
						//res.send(json_responses);
						res.send(newres);
					}
				},sellResult);
				
			
			
		}
	},buyResult);
};


 */


//
exports.updatePerson = function(req,res){
	var contact = req.param('contact');
	var birth = req.param('birth');
	var email = req.param('email');
	console.log("contact is  "+ contact);
	console.log("birth is  "+ birth);
	console.log("email" + email);
	var user = req.session.username;
	var fetProfile = "Update user set PHONE ='" + contact +"',"+"BirthDay = '" + birth +"'," +"EMAIL = '" + email +"'" +"where USERNAME ='" + user +  "';" ;
	console.log("query" + fetProfile);
	var json_responses;
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
			win_logger.log('info', 'user - '+req.session.username+' - updating individual details of the user');
			json_responses = {"statusCode" : 200};
			
			//res.send(json_responses);
			res.send(json_responses);
		}
	},fetProfile);
};

//
exports.profileDetail = function(req,res){
	var username = req.session.username;
	console.log("username is  "+ username);
	var buyResult = "Select * from orders where Buyer_Username ='" + username +"';" ;
	var sellResult = "Select * from orders where Seller_Username ='" + username +"';" ;
	var bidResults = "Select distinct(ITEM_CODE),Max_BidP, Seller_Name, Buyer_Name,ITEM_NAME,Qty  from bidOrder where " +
			"Seller_Name='" + username +"';" ;
	var bidOngoing = "select max(A.PRICE_BID) as Prce, A.ITEM_CODE, A.ITEM_NAME,A.ITEM_DESC,A.Buyer_Username," +
			" B.SELLER_USERNAME from Bid A, product B, bidCheck C where C.tme>CURRENT_TIMESTAMP and" +
			" B.Seller_Username ='" + username +"' and B.BID = 1 and A.ITEM_CODE = B.ITEM_CODE and B.ITEM_CODE = C.ITEM_CODE " +
			" group by  A.ITEM_CODE, A.ITEM_NAME,A.ITEM_DESC,A.Buyer_Username, B.SELLER_USERNAME;";
	var userBid = "select distinct(ITEM_CODE),Max_BidP,Seller_Name,ITEM_NAME from bidOrder where Buyer_Name	='" + username +"';" ;	
	
	var userOnBid = "select max(A.PRICE_BID) as Prce, A.ITEM_CODE, A.ITEM_NAME,A.ITEM_DESC,A.Buyer_Username, " +
			"B.SELLER_USERNAME from Bid A, product B, bidCheck C where C.tme>CURRENT_TIMESTAMP and " +
			"A.Buyer_Username='" + username +"' and B.BID = 1 and A.ITEM_CODE = B.ITEM_CODE and B.ITEM_CODE = C.ITEM_CODE " +
			" group by  A.ITEM_CODE, A.ITEM_NAME,A.ITEM_DESC,A.Buyer_Username, B.SELLER_USERNAME;";
	
	var bidLost = "select distinct(A.ITEM_CODE),B.Seller_Name, A.PRICE_BID, A.ITEM_NAME,A.ITEM_DESC,B.Max_BidP from bid A, bidOrder B where A.ITEM_CODE = B.ITEM_CODE and A.Buyer_Username ='" + username +"' and B.Buyer_Name<>'" + username +"';" ;	
	
	console.log("Query is:" + buyResult);
	console.log("Query is:" + sellResult);
var json_responses;
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else{
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				//var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				console.log("result" +results.length);
				console.log("result" +jsonParse);
				console.log("I am here444");
				
				mysql.fetchData(function(err1,results1){
					if(err1){
						throw err1;
					}
					else{
						var jsonString1 = JSON.stringify(results1);
						var jsonParse1 = JSON.parse(jsonString1);
						console.log("result" +results1.length);
						console.log("result" +jsonParse1);
						mysql.fetchData(function(err2,results2){
							if(err2){
								throw err2;
							}
							else{	
						var jsonString2 = JSON.stringify(results2);
						var jsonParse2 = JSON.parse(jsonString2);
						
						mysql.fetchData(function(err3,results3){
							if(err3){
								throw err3;
							}
							else{
						var jsonString3 = JSON.stringify(results3);
						var jsonParse3 = JSON.parse(jsonString3);	
						mysql.fetchData(function(err4,results4){
							if(err4){
								throw err4;
							}
							else{
						var jsonString4 = JSON.stringify(results4);
						var jsonParse4 = JSON.parse(jsonString4);
						mysql.fetchData(function(err5,results5){
							if(err5){
								throw err5;
							}
							else{
						var jsonString5 = JSON.stringify(results5);
						var jsonParse5 = JSON.parse(jsonString5);
						mysql.fetchData(function(err6,results6){
							if(err6){
								throw err6;
							}
							else{
						var jsonString6 = JSON.stringify(results6);
						var jsonParse6 = JSON.parse(jsonString6);
						var newres = {"jsonParse": jsonParse,"rowcount":results.length,"jsonParse1":jsonParse1,"rowcount1":results1.length,"jsonParse2":jsonParse2,"rowcount2":results2.length,"jsonParse3":jsonParse3,"rowcount3":results3.length,"jsonParse4":jsonParse4,"rowcount4":results4.length,"jsonParse5":jsonParse5,"rowcount5":results5.length,"jsonParse6":jsonParse6,"rowcount6":results6.length};
						console.log("result" +results5.length);
						console.log("result" +jsonParse5);
						console.log("I am here555");
								win_logger.log('info', 'user - '+req.session.username+' - fetching all details of the user');
						json_responses = {"statusCode" : 200};
						//res.send(json_responses);
						res.send(newres);
							}
						},bidLost);
							}
						},userOnBid);
							}
						},userBid);
						}
						},bidOngoing);
							}
						},bidResults);
					}
				},sellResult);
				
			
			
		}
	},buyResult);
};

