var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');
//Get Required Model

var Event    = require(__base + 'app/models/events');
var config      = require(__base + 'app/config/database');





//Route to get all locations

router.get('/' , function(req,res){
	var token = getToken(req.headers);
	if(token){
		var decoded = jwt.decode(token, config.secret);
		
		if(decoded.userType=='legalteam_member'){
			Event.find({eventOwner:decoded._id, status:'open'})
			   .exec(function(err , data){
			   		if(!err){
			   			res.status(200).json({success : true , data : data});
			   		}else{
			   			res.status(500).json({success : false , msg : err});
			   		}
			});
		}else{
			Event.find({status:'open'})
			   .exec(function(err , data){
			   		if(!err){
			   			res.status(200).json({success : true , data : data});
			   		}else{
			   			res.status(500).json({success : false , msg : err});
			   		}
			});
		}
	}else{
		res.status(403).send({success : false , msg : "Token not provided"});
	}
	
});



/**
 *  Generic token parsing function
 */
var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};





module.exports = router;