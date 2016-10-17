var ejs = require("ejs");
var mysql = require('./mysql');
var win_logger = require('winston');
		
exports.getMyProducts = function (req,res){
	var SELLER_USERNAME = req.session.username;
	console.log(req.session.firstname);
	
	//var myResult = "Select * from product where SELLER_USERNAME<>'" + SELLER_USERNAME +"'ORDER BY  GROUP_NAME;" ;
	//console.log("Query is:" + myResult);
	
	var myResult = "select B.ITEM_CODE,B.ITEM_NAME,B.ITEM_DESC,B.ITEM_PRICE,B.ITEM_QTY,B.SELLER_FIRSTNAME,B.SELLER_LASTNAME,B.EMAIL," +
			"B.SELLER_USERNAME,B.category,B.Group_Name,B.COND,B.max_price,B.min_price, (count(A.ITEM_CODE)-1) as num, B.BID,B.BidStat,B.pic from bid A, " +
			"PRODUCT B  where A.ITEM_CODE = B.ITEM_CODE and B.SELLER_USERNAME<>'" + SELLER_USERNAME+"'group by B.ITEM_CODE,B.ITEM_NAME," +
			"B.ITEM_DESC,B.ITEM_PRICE,B.ITEM_QTY,B.SELLER_FIRSTNAME,B.SELLER_LASTNAME,B.EMAIL,B.SELLER_USERNAME,B.category,B.Group_Name,B.COND,B.max_price,B.min_price,B.BID,B.BidStat,B.pic;";
	
	console.log("Query is:" + myResult);
	
	
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
				win_logger.log('info', 'user - '+req.session.username+' - product detail fetched successfully');
				console.log("result" +jsonParse);
				res.send(newres);
			}
			else{
				console.log("No reords in the database");
			}
		}
	},myResult);
};	

exports.detailofPage = function(req,res)
{
	console.log(" I m not here11");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		console.log(" I m not here12");
		win_logger.log('info', 'user - '+req.session.username+' - redirecting to detail of product page');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render('detail',{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}
	
};
/*
exports.detailofPage = function(req,res){
	res.render('detail');
};
	*/	

exports.detailofProducts = function (req,res){
	
	
	var id = req.param('id');
	req.session.id = id;
	console.log(req.session.id);
	//var myResult = "Select * from product where ITEM_CODE IN('" + 3 +"'" + ",'" + 7 +"'" +",'"+ 4 +"');" ;
	var myResult = "Select * from product where ITEM_CODE ='" + id +"';" ;
	console.log("Query is:" + myResult);
	var json_responses;
	
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
				win_logger.log('info', 'user - '+req.session.username+' - detail of the products on homepage');
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
				//res.send(newres);
			}
			else{
				console.log("No records in the database");
			}
		}
	},myResult);
};		