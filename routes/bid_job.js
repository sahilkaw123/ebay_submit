var ejs = require("ejs");
var mysql = require('./mysql');
var win_logger = require('winston');

	
	exports.bid_job = {
		    
		    after: {                
		        seconds: 0,
		        minutes:0,
		        hours: 2,
		        days: 0
		    },
		    job: function (req,res) {	
	
		    	var  output = '';
		           var id = [];
		         var output1 ='';  
		         var bidp = '';
		         var   BuyNm = '';
		         var    SellNm = '';
		        var    Qty = '';  
		        var buyN = '';
		        var sellN = '';
		        var amt = '';
		    	var bidEndTimeChk = "Select A.Item_Code from bidCheck A, bidStat B where A.tme <= Current_Timestamp and A.ITEM_CODE = B.ITEM_CODE and B.BidStat = 0;" ;
		    	
		    			
		    	mysql.fetchData(function(err,results){
		    		if(err){
		    			throw err;
		    		}
		    		else{
		    			if(results.length > 0){
		    				console.log("Bids Complete." + "\n");
		    				console.log(results);
							win_logger.log('info', 'user -  - checking bidding time cron job');
		    				for (var i in results) {
		    		         var  output = results[i];
		    		           id.push = output.Item_Code;
		    				}
		    		            console.log(id);
		    		            var updateStat = "update bidStat set BidStat = 1 where ITEM_CODE ='" + results[i].Item_Code +"';";
		    		            	mysql.fetchData(function(err1,results1){
		    		            		if(err1){
		    				    			throw err;
		    				    		}
		    				    		else{
											win_logger.log('info', 'user -  - updating bidding status to completed for all products in Bidstat table whose bidding ended cron job');
		    				    			var insMaxBid = "INSERT INTO bidOrder Select A.ITEM_CODE,  max(A.PRICE_BID) as M_Price, B.Seller_USERNAME, A.Buyer_Username,A.ITEM_NAME, A.Qty from bid_dup A , Product B  where A.Buyer_Username IS NOT NULL and A.ITEM_CODE = B.ITEM_CODE  group by A.ITEM_CODE, A.ITEM_NAME, A.Buyer_Username,A.Qty,B.Seller_USERNAME having max(A.PRICE_BID) =(Select max(PRICE_BID) from bid where ITEM_CODE = '" + results[i].Item_Code  +"')";		
		    		            			mysql.fetchData(function(err2,results2){
		    		            				if(err2){
				    				    			throw err;
				    				    		}
		    		            				else{
													win_logger.log('info', 'user -  - inserting into bidOrder table cron job');
		    		            					 var updtProd = "update product set BidStat = 1 where ITEM_CODE ='" + results[i].Item_Code +"';";		
		    		            					mysql.fetchData(function(err6,results6){
		    		            						if(err6){
						    				    			throw err;
						    				    		}
		    		            						else{
															win_logger.log('info', 'user -  - updating bidding status to completed for all products in product table whose bidding ended cron job');
		    		            					var finddet = "Select Max_BidP, Seller_Name, Buyer_Name,Qty from bidOrder where ITEM_CODE ='" + results[i].Item_Code  +"';";
		    		            					mysql.fetchData(function(err3,results3){
		    		            						if(err3){
						    				    			throw err;
						    				    		}
				    		            				else{
															win_logger.log('info', 'user -  - chosing the max bid price and buyer');
				    		            					if(results3.length>0){
				    		            					for (var i in results3) {
				    		            			            output1 = results3[i];
				    		            			            bidp = output1.Max_BidP;
				    		            			            BuyNm = output1.Buyer_Name;
				    		            			            SellNm = output1.Seller_Name;
				    		            			            Qty = output1.Qty;      
				    		            			      }
				    		            					buyN = BuyNm;
				    		            					sellN = SellNm;
				    		            					amt = bidp;
				    		            					console.log(buyN);
				    		            					console.log(sellN);
				    		            			var addMoney = "Update user set Balance = Balance +" + amt +""+" where username ='"+sellN +"';";
				    		            			mysql.fetchData(function(err4,results4){
				    		            				if(err4){
						    				    			throw err;
						    				    		}
				    		            				else{
															win_logger.log('info', 'user -  - updating seller account money ');
				    		            					var delMoney =  "Update user set Balance = Balance -" + amt +" "+"where username ='"+buyN+"';";
				    		            					mysql.fetchData(function(err5,results5){
						    		            				if(err5){
								    				    			throw err;
								    				    		} else{
																	win_logger.log('info', 'user -  - updating buyer account and QTY');
								    				    			console.log("Done for checking");
								    				    			
								    				    			}
				    		            				},delMoney);
				    		            				}
				    		            			},addMoney);
				    		            				}		
		    		            				}
		    		            					},finddet);
		    		            					}
		    		            				},updtProd);
		    		            				}
		    		            			},insMaxBid);
		    				    		}
		    		            	},updateStat);
		    			}}
		    	},bidEndTimeChk);
		    }};
