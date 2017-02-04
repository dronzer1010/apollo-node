var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Notes    = require(__base + 'app/models/notesMaster');
var Task    = require(__base + 'app/models/taskMaster');
var config      = require(__base + 'app/config/database');





//Route to get messages by ticketId

router.get('/:tid' , function(req,res){
    if(!req.params.tid){
        res.status(400).json({success : false , msg : "no task id"});
    }else{
        Task.findOne({_id:req.params.tid},function(err,data){
        if(!err){
            if(data){
                var populateQuery = [{path:'senderId'}];
                Notes.find({threadId:data.notesThread})
                .exec(function(err,messages){
                    if(!err){
                        res.status(200).json({success : true , data : messages});
                    }else{
                        res.status(400).json({success : false , msg : err});
                    }
                });
            }else{
                res.status(400).json({success : false , msg : "No data"});
            }
        }else{
            res.status(400).json({success : false , msg : err});
        }
    });
    }
});


//Route to add location

router.post('/' , function(req, res){
	if(!req.body.threadId || !req.body.senderEmail ||!req.body.note){
		res.status(200).json({success : false , msg : "Invalid Parameter"});
	}else{
		var newMessage = new Notes({
			threadId : req.body.threadId,
			senderEmail  : req.body.senderEmail,
            note : req.body.note
		});

		newMessage.save(function(err ,data){
			if(!err){
				res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});



module.exports = router;