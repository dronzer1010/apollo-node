var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var CronJob = require('cron').CronJob;
//Get Required Model

var Designation = require(__base + 'app/models/designationMaster');






//Route to get all designations

router.get('/' , function(req,res){
	Designation.find({})
			   .exec(function(err , data){
			   		if(!err){
			   			res.status(200).json({success : true , data : data});
			   		}else{
			   			res.status(500).json({success : false , msg : err});
			   		}
			   });
});


//Route to add designation

router.post('/' , function(req, res){
	if(!req.body.designation || !req.body.short_name){
		res.status(200).json({success : false , msg : "Invalid Parameter"});
	}else{
		var newDesignation = new Designation({
			designation : req.body.designation,
			short_name  : req.body.short_name
		});

		newDesignation.save(function(err ,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});

router.put('/:id' , function(req,res){
	Designation.update({_id : req.params.id} , {
		$set : {
			designation : req.body.designation ,
			short_name : req.body.short_name
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
	Designation.remove({_id : req.params.id} ,function(err ,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});





module.exports = router;