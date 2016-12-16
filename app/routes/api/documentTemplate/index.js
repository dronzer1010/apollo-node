var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Document   = require(__base + 'app/models/documentTemplateField');
var config      = require(__base + 'app/config/database');


router.get('/' , function(req,res){
	Document.find({})
			   .exec(function(err , data){
			   		if(!err){
			   			res.status(200).json({success : true , data : data});
			   		}else{
			   			res.status(500).json({success : false , msg : err});
			   		}
			   });
});

router.post('/' , function(req, res){
	if(!req.body.legalType){
		res.status(400).json({success : false , msg : "Invalid Parameter"});
	}else{
		var newDocument = new Document({
			description : (req.body.description)?req.body.description:"",
			legalType  : req.body.legalType,
            mandatory : (req.body.mandatoy)?req.body.mandatoy : "N",
            fields : (req.body.fields)?req.body.fields : []
		});

		newDocument.save(function(err ,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});


router.put('/:id' , function(req,res){
	if(!req.body.legalType){
		res.status(400).json({success : false , msg : "Invalid Parameter"});
	}else{
		Document.update({_id : req.params.id },{
			$set:{

				description : (req.body.description)?req.body.description:"",
				legalType  : req.body.legalType,
				mandatory : (req.body.mandatoy)?req.body.mandatoy : "N",
				fields : (req.body.fields)?req.body.fields : []
			}
		}).exec(function(err ,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});


router.delete('/:id' , function(req,res){
	Document.remove({_id : req.params.id} ,function(err ,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});

module.exports = router;