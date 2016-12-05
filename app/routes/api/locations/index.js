var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Location    = require(__base + 'app/models/locationMaster');
var config      = require(__base + 'app/config/database');





//Route to get all locations

router.get('/' , function(req,res){
	Location.find({})
			   .exec(function(err , data){
			   		if(!err){
			   			res.status(200).json({success : true , data : data});
			   		}else{
			   			res.status(500).json({success : false , msg : err});
			   		}
			   });
});


//Route to add location

router.post('/' , function(req, res){
	if(!req.body.name || !req.body.division){
		res.status(200).json({success : false , msg : "Invalid Parameter"});
	}else{
		var newLocation = new Location({
			name : req.body.name,
			division  : req.body.division
		});

		newLocation.save(function(err ,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});

router.put('/:id' , function(req,res){

	console.log('request is '+req.body.name);
	Location.update({_id : req.params.id} , {
		$set : {
			name : req.body.name ,
			division : req.body.division
		}
	},function(err ,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});

router.delete('/:id' , function(req,res){
	Location.remove({_id : req.params.id} ,function(err ,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});

module.exports = router;