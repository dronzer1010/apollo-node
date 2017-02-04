var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Message    = require(__base + 'app/models/messageMaster');
var Ticket    = require(__base + 'app/models/ticketMaster');
var config      = require(__base + 'app/config/database');





//Route to get messages by ticketId

router.get('/:tid' , function(req,res){
    if(!req.params.tid){
        res.status(400).json({success : false , msg : "No ticket id"});
    }else{
        Ticket.findOne({_id:req.params.tid},function(err,data){
        if(!err){
            if(data){
                var populateQuery = [{path:'senderId'}];
            Message.find({threadId:data.messageThread}).
            populate(populateQuery)
            .exec(function(err,messages){
                if(!err){
                    res.status(200).json({success : true , data : messages});
                }else{
                    res.status(500).json({success : false , msg : err});
                }
            });
            }else{
                res.status(400).json({success : false , msg : "No Data Found"});
            }
        }else{
            res.status(500).json({success : false , msg : err});
        }
    });
    }
});


//Route to add location

router.post('/' , function(req, res){
	if(!req.body.threadId || !req.body.senderId ||!req.body.message){
		res.status(200).json({success : false , msg : "Invalid Parameter"});
	}else{
		var newMessage = new Message({
			threadId : req.body.threadId,
			senderId  : req.body.senderId,
            message : req.body.message
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