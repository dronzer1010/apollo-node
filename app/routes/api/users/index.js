var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');
var bcrypt = require('bcrypt');
//Get Required Model

var User = require(__base + 'app/models/userMaster');
var config = require(__base + 'app/config/database');


router.get('/u' , function(req,res){
	var populateQuery = [{path:'designation'},{path:'location'}];

	if(req.query.des){
		console.log(req.query.des);
		User.find({markAsDeleted : false , designation : req.query.des })
		.populate(populateQuery)
		.exec(function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
	}else{
		User.find({markAsDeleted : false})
		.populate(populateQuery)
		.exec(function(err,data){
			if(!err){
			}else{
				res.status(400).json({success : false , msg : err});
				res.status(200).json({success : true , data : data});
			}
		});
	}
});



router.get('/markedusers' , function(req,res){
	var populateQuery = [{path:'designation'},{path:'location'}];

	User.find({markAsDeleted : false , markDirect : true})
		.populate(populateQuery)
		.exec(function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
});


router.post('/' , function(req,res){
	if(!req.body.firstName || !req.body.email || !req.body.password || !req.body.designation || !req.body.location || !req.body.userType){
		res.status(400).json({success : false , msg : "Invalid parameters"});
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
				res.status(400).json({success : false , msg : err});
			}
		});	
	}
});

router.put('/:id',function(req,res){
console.log(req.body.firstName+' '+req.body.email+' '+req.body.password+' '+req.body.designation+' '+req.body.location+' '+req.body.userType);

	if(!req.body.firstName || !req.body.email || !req.body.password || !req.body.designation || !req.body.location || !req.body.userType){
		console.log('nahi chla');
		res.status(400).json({success : false , msg : "Invalid parameters"});
	}else{
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);
		req.body.password = hash;
		User.update({_id : req.params.id},{$set:{
			firstName : req.body.firstName,
			lastName : (req.body.lastName)?req.body.lastName:'',
			email : req.body.email,
			// password : req.body.password,
			designation : req.body.designation,
			location : req.body.location,
			userType : req.body.userType ,
			markDirect : (req.body.markDirect)?req.body.markDirect:false,
			active : (req.body.active)?req.body.active:false
		}},function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
	}
});
router.post('/activate' , function(req,res){
	if(!req.body.id ){
		res.status(400).json({success : false , msg : "Invalid parameters"});
	}else{
		console.log('status '+req.body.status);
		User.update({_id:req.body.id},{$set:{active : req.body.status}},function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
	}
});


router.post('/direct' , function(req,res){
	if(!req.body.id ){
		res.status(400).json({success : false , msg : "Invalid parameters"});
	}else{
		console.log('status '+req.body.status);
		User.update({_id:req.body.id},{$set:{markDirect : req.body.status}},function(err,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
	}
});

router.delete('/:id' , function(req,res){
	User.update({_id:req.params.id},{$set:{markAsDeleted:true}},function(err,data){
		if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(400).json({success : false , msg : err});
			}
		});
});

router.post('/login' , function(req,res){
	if(!req.body.email || !req.body.password){
		res.status(400).json({
			success : false ,
			msg : "Invalid parameters"
		});
	}else{	
		User.findOne({email : req.body.email},function(err , user){
			if (err) throw err;
         
            if (!user) {
              res.status(400).send({success: false, msg: 'Authentication failed. User not found.'});
            }else{
            	user.comparePassword(req.body.password , function(err , isMatch){
            		if(!err && isMatch){
            			var tokenData ={};
	                      tokenData._id = user._id;
	                      tokenData.username = user.email;
	                      tokenData.password = user.password;
	                      tokenData.userType = user.userType;
	                    var token = jwt.encode(tokenData, config.secret);
            			res.status(200).json({success : true , data :{
            				id : user._id ,
							email : user.email,
            				userType : user.userType,
            				name : user.firstName+' '+user.lastName ,
            				auth_token : 'JWT '+token
            			}});
            		}else{
            			res.status(400).send({success: false, msg: 'Authentication failed.Password do not match'});
            		}
            	});
            }
		});
	}
});

/*
router.post("/admin/changepassword" , function(req,res){
	if(!req.body.userId || !req.body.password){
		res.status(400).send({success: false, msg: 'Invalid Data'});
	}else{
		var salt = bcrypt.genSaltSync(10);
		var hash = bcrypt.hashSync(req.body.password, salt);
		var newpassword = hash;

		User.update({_id:req.body.userId},{$set:{password:newpassword}} , function(err ,data){
			if(!err){
				res.status(200).send({success: true, msg: 'Password Updated'});
			}else{
				res.status(400).send({success: false, msg: 'Password update failed' , err :err});	
			}
		});
	}
});*/
module.exports = router;