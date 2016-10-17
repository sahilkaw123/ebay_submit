var ejs = require("ejs");
//var mysql = require('./mysqlpool');  // using pool
var mysql = require('./mysql'); // without using pool

var win_logger = require('winston');
// to validate  the login user signin function 
//
var crypto = require('crypto'),
algorithm = 'aes-256-ctr',
password = 'test123';

function encrypt(text){
var cipher = crypto.createCipher(algorithm,password);
var crypted = cipher.update(text,'utf8','hex');
crypted += cipher.final('hex');
return crypted;
}

function decrypt(text){
var decipher = crypto.createDecipher(algorithm,password);
var dec = decipher.update(text,'hex','utf8');
dec += decipher.final('utf8');
return dec;
}

//
exports.checksignin = function(req,res){
	
	
	
	var username = req.param('username');
	var password1 = req.param('password');
	var password = encrypt("password1");
	var json_responses;
	
	if((username!=='') && (password !=='')){
		var getUser = "select * from user where username='" + username +
						"'" + "or email='" + username +"' and password='" + password +"'";
		console.log("Query is :" +getUser);
		var updtTime = "Update user set Ltime = Now() where username='" + username +"'";
	
	mysql.fetchData(function (err, results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("Credentials accepted ");
				req.session.destroy();
				var username = results[0].USERNAME;
				var email = results[0].EMAIL;
				var firstname1 = results[0].FIRSTNAME;
				var firstname = firstname1.toUpperCase(); 
				var lastname1 = results[0].LASTNAME;
				var lastname = lastname1.toUpperCase();
				var dateTime = results[0].Ltime;
				var d = new Date(dateTime);
				var dateT = d.toString();
				console.log(dateT);
				
				var date1 = dateT.substring(0, 15);
				console.log(date1);
				req.session.date = date1;
				var time1 = dateT.substring(16, 24);
				console.log(time1);
				req.session.time = time1;
				req.session.username = username; // To assign the session to the user
				req.session.firstname = firstname;// To assign the session to the firstname
				req.session.lastname = lastname;// To assign the session to the firstname
				req.session.email = email; // To assign the session to the email
				console.log("Session Initialized");
				console.log(results);
				console.log(req.session.username);
				console.log(req.session.firstname);
				console.log(req.session.lastname);
				console.log(req.session.email);
				win_logger.log('info', 'user - '+req.session.username+' - successfully in login');
				json_responses = {"statusCode" : 200};
				res.send(json_responses);
				mysql.fetchData(function (err, results){
					if(err){
						throw err;
					}
					else{
						console.log("User logged in time noted");
					}
				},updtTime);
			}
			else{
				console.log("Invalid Credentials");
				win_logger.log('info', 'user - '+req.session.username+' - unsuccessfully in login');
				json_responses = {"statusCode" : 401,"rowcount":results.length};
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

//backup
/*
exports.checksignin = function(req,res){
	
	
	
	var username = req.param('username');
	var password = req.param('password');
	
	var json_responses;
	
	if((username!=='') && (password !=='')){
		var getUser = "select * from user where username='" + username +
						"'" + "or email='" + username +"' and password='" + password +"'";
		console.log("Query is :" +getUser);
		var updtTime = "Update user set Time = Now();";
	
	mysql.fetchData(function (err, results){
		if(err){
			throw err;
		}
		else{
			if(results.length > 0){
				console.log("Credentials accepted ");
				req.session.destroy();
				var username = results[0].USERNAME;
				var email = results[0].EMAIL;
				var firstname1 = results[0].FIRSTNAME;
				var firstname = firstname1.toUpperCase(); 
				var lastname1 = results[0].LASTNAME;
				var lastname = lastname1.toUpperCase();
				req.session.username = username; // To assign the session to the user
				req.session.firstname = firstname;// To assign the session to the firstname
				req.session.lastname = lastname;// To assign the session to the firstname
				req.session.email = email; // To assign the session to the email
				console.log("Session Initialized");
				console.log(results);
				console.log(req.session.username);
				console.log(req.session.firstname);
				console.log(req.session.lastname);
				console.log(req.session.email);
				json_responses = {"statusCode" : 200};
		
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

*/

//
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
		win_logger.log('info', 'user - '+req.session.username+' - redirect to homepage');
		//Set these headers to notify the browser not to maintain any cache for the page being loaded
		res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
		res.render("homepage",{username:req.session.username,firstname:req.session.firstname,lastname:req.session.lastname,date:req.session.date,time:req.session.time});
		
	}
	else
	{
		res.redirect('/signin');
	}
};

//signup success
exports.success = function(req,res)
{
	console.log(" I m signup");
	
	
		res.render("success",{username:req.session.username,firstname:req.session.firstname});
		
	
	
};


//

//signup failure
exports.exists = function(req,res)
{
	console.log(" I already exist");
	
	
		res.render("exists",{email:req.session.email,firstname:req.session.firstname});
		
	
	
};

//
//Logout the user - invalidate the session
exports.logout = function(req,res)
{
	req.session.destroy();
	console.log("session username"+" -->  " + " " + req.session.username);
	res.render("signout");
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
exports.afterSignUp = function(req,res)
{
	// check user already exists
	
	var first = req.param("firstname");
	var last = req.param("lastname");
	var email = req.param("email");
	var json_responses;
	var password1 = req.param("password");
	var password = encrypt("password1");
	var user = first.substring(0,4) + last.substring(0,4) +"_" + Math.round(Math.random()*1000);
	var checkUser="select * from user where email='"+ email + "'";
	//var addUser = "INSERT INTO user (username, firstname, lastname, email, phone, password) VALUES  " +
    //"('" + user + "','"+ req.param("firstname") +"','" + 
    //req.param("lastname") +"','" + req.param("email") +"','" + req.param("phone") +"','" +
    //req.param("password")+"')";
	
	var addUser = "INSERT INTO user (username, firstname, lastname, email, phone, password) VALUES  " +
    "('" + user + "','"+ req.param("firstname") +"','" + 
    req.param("lastname") +"','" + req.param("email") +"','" + req.param("phone") +"','" +
    password +"')";
	
	console.log("Query is:"+addUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("User Exists");
				req.session.email = email;
				req.session.firstname = first;
				win_logger.log('info', 'user - '+first+ last +' - checking while signup if user exists');
				json_responses = {"statusCode" : 401};
				res.send(json_responses);
			}
			else{
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{		
						console.log("User Created");
						req.session.username = user; // To assign the session to the user
						req.session.firstname = first;// To assign the session to the firstname
						console.log(req.session.username);
						console.log(req.session.firstname);
						win_logger.log('info', 'user - '+first+ last +' - successfully asinging unique username');
						json_responses = {"statusCode" : 200};
						res.send(json_responses);
						
					}  
				},addUser);	
			} 
		}
	},checkUser);
};


/*
exports.afterSignUp = function(req,res)
{
	// check user already exists
	
	var first = req.param("firstname");
	var last = req.param("lastname");
	
	
	
	var user = first.substring(0,4) + last.substring(0,4) +"_" + Math.round(Math.random()*1000);
	var checkUser="select * from user where email='"+ user + "'";
	var addUser = "INSERT INTO user (username, firstname, lastname, email, phone, password) VALUES  " +
    "('" + user + "','"+ req.param("firstname") +"','" + 
    req.param("lastname") +"','" + req.param("email") +"','" + req.param("phone") +"','" +
    req.param("password")+"')";
	
	console.log("Query is:"+addUser);
	
	mysql.fetchData(function(err,results){
		if(err){
			throw err;
		}
		else 
		{
			if(results.length > 0){
				console.log("User exist." + "\n");
				res.render('signin', { data: results } , function(err, result) {
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
			else{
				mysql.fetchData(function(err,results){
					if(err){
						throw err;
					}
					else 
					{					
						res.render('success',function(err, result) {
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
				},addUser);	
			} 
		}
	},checkUser);
};
*/