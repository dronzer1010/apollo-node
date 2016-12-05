var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var User = require(__base + 'app/models/userMaster');

router.get('/' , function(req,res){
	var populateQuery = [{path:'designation'},{path:'location'}];

	User.find({markAsDeleted : false})
		.populate(populateQuery)
		.exec(function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
});

router.post('/' , function(req,res){
	if(!req.body.firstName || !req.body.email || !req.body.password || !req.body.designation || !req.body.location || !req.body.userType){
		res.status(200).json({success : false , msg : "Invalid parameters"});
	}else{
		var newUser = new User({
			firstName : req.body.firstName,
			lastName : (req.body.lastName)?req.body.lastName:'',
			email : req.body.email,
			password : req.body.password,
			designation : req.body.designation,
			location : req.body.location,
			userType : req.body.userType ,
			markDirect : (req.body.markDirect)?req.body.markDirect:false,
			active : (req.body.active)?req.body.active:false
		});

		newUser.save(function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});	
	}
});

router.put('/:id',function(req,res){
console.log(req.body.firstName+' '+req.body.email+' '+req.body.password+' '+req.body.designation+' '+req.body.location+' '+req.body.userType);

	if(!req.body.firstName || !req.body.email || !req.body.password || !req.body.designation || !req.body.location || !req.body.userType){
		console.log('nahi chla');
		res.status(200).json({success : false , msg : "Invalid parameters"});
	}else{
		User.update({_id : req.params.id},{$set:{
			firstName : req.body.firstName,
			lastName : (req.body.lastName)?req.body.lastName:'',
			email : req.body.email,
			password : req.body.password,
			designation : req.body.designation,
			location : req.body.location,
			userType : req.body.userType ,
			markDirect : (req.body.markDirect)?req.body.markDirect:false,
			active : (req.body.active)?req.body.active:false
		}},function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});
router.post('/activate' , function(req,res){
	if(!req.body.id ){
		res.status(200).json({success : false , msg : "Invalid parameters"});
	}else{
		console.log('status '+req.body.status);
		User.update({_id:req.body.id},{$set:{active : req.body.status}},function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});


router.post('/direct' , function(req,res){
	if(!req.body.id ){
		res.status(200).json({success : false , msg : "Invalid parameters"});
	}else{
		console.log('status '+req.body.status);
		User.update({_id:req.body.id},{$set:{markDirect : req.body.status}},function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});

router.delete('/:id' , function(req,res){
	User.update({_id:req.params.id},{$set:{markAsDeleted:true}},function(err,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
});
module.exports = router;