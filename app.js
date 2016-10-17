var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var home = require('./routes/home');
var routes = require('./routes/index');
var users = require('./routes/users');
var session = require('client-sessions');
var product = require('./routes/product');
var cart = require('./routes/cart');
var detail = require('./routes/detail');
var cart = require('./routes/cart');
var order = require('./routes/order');
var bid = require('./routes/bid');
var sell = require('./routes/sell');
var profile = require('./routes/profile');
var mysql = require('./routes/mysql2');
var app = express();

app.use(session({   
	  
	cookieName: 'session',    
	secret: 'cmpe273_test_string',    
	duration: 30 * 60 * 1000,    //setting the time for active session
activeDuration: 5 * 60 * 1000, })); // setting time for the session to be active when the window is open // 5 minutes

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
//mysql.createConnectionPool();
//GET
app.get('/', home.signin);
app.get('/signin', home.signin);
app.get('/homepage',home.redirectToHomepage);
//Today
app.get('/signup', home.signup);
app.get('/success', home.success);
app.get('/exists', home.exists);
app.get('/getMyProducts', product.getMyProducts);
app.get('/detail', product.detailofPage);
app.get('/detailProduct', detail.detailProduct);
app.get('/cart', cart.displayCartPage);
app.get('/displayProducts', cart.displayProducts);
app.get('/order', order.confirmOrder);
app.get('/checkOutProducts', order.checkOutProducts);
//app.get('detail', product.detailofPage);
app.get('/placeOrder', order.confirmPage);
app.get('/getCreditCardDetails', order.getCreditCardDetails);
app.get('/confirmBidPage', bid.confirmBidPage);

app.get('/bidTimeFetch', bid.bidTimeFetch);
app.get('/updateMoney', order.updateMoney);

//Bid Get
app.get('/bidProduct' , bid.bidProduct);
app.get('/bid', bid.bidPage);
//Sell Get
app.get('/sell', sell.loadSellPage);
app.get('/profile', profile.openProfilePage);
app.get('/profileDetail', profile.profileDetail);
app.get('/person', profile.person);
app.get('/personDetail', profile.personDetail);
app.get('/historyProduct',bid.historyProduct);
//app.get('/confirm',order.confirmPage);
app.get('/list',sell.listPage);
app.get('/listDetail',sell.listProd);
//POST
app.post('/checksignin' , home.checksignin);
app.get('/signout', home.logout);
app.get('/bidHistory', bid.bidHistory);

//app.post('/signout',home.logout);
//Today
app.post('/afterSignUp', home.afterSignUp);
app.post('/addProducts' , cart.addProducts);
app.post('/updatePerson' , profile.updatePerson);
//app.post('/buyProducts' , cart.buyProducts);
app.post('/detailofProducts', detail.detailofProducts);
app.post('/detailofBidProducts', detail.detailofBidProducts);
app.post('/removeProducts', cart.removeProducts);


//BID POST
app.post('/bidCmp', bid.bidCmp);
app.post('/insertProduct',sell.insertProduct);
app.post('/bidHistoryProd', bid.bidHistoryProd);

//cron jobs 
var cronjob = require('node-cron-job');


cronjob.setJobsPath(__dirname + '/routes/bid_job.js');  // Absolute path to the jobs module. 
 
cronjob.startJob('bid_job');
//
// catch 404 and forward to error handler

//logs generator
var win_logger = require('winston');

win_logger.add(
	win_logger.transports.File, {
    filename: 'logsofProg.log',
    level: 'info',
    json: true,
    eol: 'rn', // for Windows, or `eol: ‘n’,` for *NIX OSs
    timestamp: true
  }
);
//
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
