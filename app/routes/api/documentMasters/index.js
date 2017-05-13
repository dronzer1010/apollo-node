var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Document = require(__base + 'app/models/documentMaster');






//Full Text Search

router.post('/search' , function(req,res){
	if(req.body.query){
		var q=req.body.query;
		var query = new RegExp(q, "i");
		Document.find({$text:{$search:q} ,  approved : true })
				
				.exec(function(err , docs){
			if(!err){
				res.status(200).send({
					success : true ,
					data : docs
				});
			}else{
				res.status(400).send({
					success : false ,
					msg :err
				});
			}
		});
	}else{
		res.status(400).send({
			success:false,
			msg : "invalid Query"
		});
	}
});


router.post('/approve/:id' , function(req,res){

    console.log(req.body);
   
	Document.update({_id : req.params.id} , {
		$set : {
            approved:true,
            documentType:req.body.documentType,
			additionalDetails : req.body.docAdditionalDetail ,
			approvalBy : req.body.approvedBy,
            approvalDoneBy :req.body.approvalDoneBy
		}
	},function(err ,data){
		if(!err){
                console.log(data);
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});


router.put('/changename/:id' , function(req,res){

    console.log(req.body);
   
	Document.update({_id : req.params.id} , {
		$set : {
            documentName:req.body.newName
		}
	},function(err ,data){
		if(!err){
                console.log(data);
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
	});
});



module.exports = router;