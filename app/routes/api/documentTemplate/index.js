var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Document   = require(__base + 'app/models/documentTemplateField');
var DocumentApproval   = require(__base + 'app/models/documentApprovalMaster');
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


router.get('/approved' , function(req,res){
	
	Document.find({approved : false})
			.exec(function(err ,docs){
						if(!err){
							res.status(200).json({success : true , data : docs});
						}else{
							res.status(400).json({success : false , msg : err});
						}
			});
});




/************** Document Approval */
router.get('/approve' , function(req,res){
	var populateQuery = [{path:'documentTemplateId'},{path:'designations.designation'}];
	DocumentApproval.find({})
					.populate(populateQuery)
					.exec(function(err ,docs){
						if(!err){
							res.status(200).json({success : true , data : docs});
						}else{
							res.status(400).json({success : false , msg : err});
						}
					});
});

router.get('/approve/:id' , function(req,res){
	var populateQuery = [{path:'documentTemplateId'},{path:'designations.designation'}];
	DocumentApproval.findOne({_id:req.params.id})
					.populate(populateQuery)
					.exec(function(err ,docs){
						if(!err){
							res.status(200).json({success : true , data : docs});
						}else{
							res.status(400).json({success : false , msg : err});
						}
					});
});

router.put('/approve/:id' , function(req,res){
	//var populateQuery = [{path:'documentTemplateId'},{path:'designations.designation'}];
	DocumentApproval.update({_id:req.params.id},{$set:{designations:req.body.designations}})
					//.populate(populateQuery)
					.exec(function(err ,docs){
						if(!err){
							res.status(200).json({success : true , data : docs});
						}else{
							res.status(400).json({success : false , msg : err});
						}
					});
});

router.delete('/approve/:id' , function(req,res){
	//var populateQuery = [{path:'documentTemplateId'},{path:'designations.designation'}];
	DocumentApproval.findOne({_id:req.params.id} , function(err,doc){
		if(!err){
			if(doc){
				console.log(doc.documentTemplateId);
				Document.update({_id:doc.documentTemplateId},{$set:{approved : false}},function(err,data){
					if(!err){
						console.log("Document Reset");
					};
				});
			}
		}
	});
	DocumentApproval.remove({_id:req.params.id})
					//.populate(populateQuery)
					.exec(function(err ,docs){
						if(!err){
							res.status(200).json({success : true , data : docs});
						}else{
							res.status(400).json({success : false , msg : err});
						}
					});
});


router.post('/approve' , function(req,res){
	if(!req.body.documentId || !req.body.designations){
		res.status(400).json({success : false , msg : "Invalid data"});
	}else{
		Document.findOne({_id:req.body.documentId},function(err,doc){
			if(!err){
				if(doc){
					if(doc.approved){
						res.status(200).json({success : false , msg : "Document Already Approved"});	
					}else{
						var newDocApproval = new DocumentApproval({
							documentTemplateId : req.body.documentId,
							designations : req.body.designations
						});

						newDocApproval.save(function(err,docApproval){
							if(!err){
								Document.update({_id:req.body.documentId},{$set:{approved:true}},function(err,doc){
									if(!err){
										res.status(200).json({success : true , msg : "Document Approval Added"});
									}else{
										res.status(400).json({success : false , msg : err});
									}
								});
							}else{
								res.status(400).json({success : false , msg : err});
							}
						});
					}
				}else{
					res.status(400).json({success : false , msg : "Document Not Found"});
				}
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
	}
});

module.exports = router;