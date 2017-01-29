var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Task    = require(__base + 'app/models/taskMaster');
var Ticket   = require(__base + 'app/models/ticketMaster');
var config      = require(__base + 'app/config/database');





//Route to add location

router.post('/' , function(req, res){
	if(!req.body.name || !req.body.type || !req.body.handlerEmail){
		res.status(200).json({success : false , msg : "Invalid Parameter"});
	}else{
		var newTask = new Task({
			taskName : req.body.name,
			taskType  : req.body.type,
            taskCompletionDate:req.body.completionDate,
            taskHandlingLocation : req.body.handlingLocation,
            taskHandlerName : req.body.handlerName,
            taskHandlerEmail : req.body.handlerEmail,
            taskHandlerLocation : req.body.handlerLocation,
            taskHandlerContactNo : req.body.handlerNo,
            taskPrivacy : req.body.taskPrivacy,
            status : 'open',
            taskMaster : req.body.master
		});

		newTask.save(function(err ,task){
			if(!err){
                Ticket.update({_id:req.body.ticketId},{$push:{task_list : task._id}}, function(err,data){
                    if(!err){
                        res.status(200).json({success : true , data : data});
                    }else{
                        res.status(500).json({success : false , msg : err});   
                    }
                });
				//res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});


module.exports = router;