var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mysql = require('./mysql'); // without using pool

var win_logger = require('winston');
// to validate  the login user signin function 

exports.listProd = function(req,res){
	
	
	
	
	
	var json_responses;
	
	
		var getList = "select * from product where ITEM_CODE = (SELECT max(ITEM_CODE) from product);";
	
	
	mysql.fetchData(function (err, results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				var jsonString = JSON.stringify(results);
				var jsonParse = JSON.parse(jsonString);
				var newres = {"jsonParse": jsonParse,"rowcount":results.length};
				win_logger.log('info', 'user - '+req.session.username+' - fetching details of new product listed by user');
				json_responses = {"statusCode" : 200};
				
				res.send(newres);
				
			}
		}	
		},getList);
	
};//login function ends 

//rendering to signin page of ebay 

exports.signin = function(req,res){
	res.render('signin');
};




//HomePage redirection

//Redirects to the homepage
exports.loadSellPage = function(req,res)
{
	console.log(" I m here to Sell");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - loading the selling page for user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("sell",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname,email:req.session.email});
		
	}
	else
	{
		res.redirect('/signin');
	}
};

//Logout the user - invalidate the session

exports.listPage = function(req,res)
{
	console.log(" I m here");
	
	//Checks before redirecting whether the session is valid
	console.log(req.session.username);
	if(req.session.username)
	{
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		win_logger.log('info', 'user - '+req.session.username+' - showing the listing to the user');
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("ProductListing",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname});
		
	}

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

// sign up validation
exports.insertProduct = function(req,res)
{
	// check user already exists
	
	var S_FIRSTNAME = req.session.firstname;
	var S_LASTNAME  = req.session.lastname;
	var EMAIL = req.session.email;
	var S_USERNAME = req.session.username;
	var ITEM_NAME = req.param('ITEM_NAME');
	var ITEM_PRICE = req.param('ITEM_PRICE');
	var ITEM_QTY = req.param('ITEM_QTY');
	var ITEM_DESC = req.param('ITEM_DESC');
	var min_price = req.param('min_price');
	var category  = req.param('category');
	var BID   = req.param('BID');
	var Group_Name  = req.param('Group_Name');
	var COND   = req.param('COND');
	
	console.log(S_FIRSTNAME);
	console.log(S_LASTNAME);
	console.log(S_USERNAME);
	console.log(EMAIL);
	var json_responses;
	
	
	
	
	var addProd = "INSERT INTO product (ITEM_NAME, ITEM_DESC, ITEM_PRICE, ITEM_QTY, SELLER_FIRSTNAME, SELLER_LASTNAME, EMAIL, SELLER_USERNAME,category,Group_Name,BID,COND,min_price) VALUES  " +
    "('" + ITEM_NAME  + "','"+ ITEM_DESC +"','" + ITEM_PRICE + "','" + ITEM_QTY  + "','" + S_FIRSTNAME +"','" + S_LASTNAME  + "','"+ EMAIL +"','" + S_USERNAME  + "','"+ category +"','" +  Group_Name +"','" + BID +"','"+ COND +"','"  +ITEM_PRICE+"')";
	
	console.log("Query is:"+addProd);
	
	mysql.fetchData(function (err, results){
		if(err){
			throw err;
		}
		
			else 
			{
				win_logger.log('info', 'user - '+req.session.username+' - inserting into the product table new product');
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
			}  
		},addProd);	
	
	
};
