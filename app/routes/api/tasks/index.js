var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model

var Task    = require(__base + 'app/models/taskMaster');
var Ticket   = require(__base + 'app/models/ticketMaster');
var NotesThread = require(__base + 'app/models/notesThreadMaster');
var config      = require(__base + 'app/config/database');
var helper = require('sendgrid').mail;




//Route to create task as well as send email

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
            taskMaster : req.body.master,
            ticketId:req.body.ticketId
		});

		newTask.save(function(err ,task){
			if(!err){
                Ticket.update({_id:req.body.ticketId},{$push:{task_list : task._id}}, function(err,data){
                    if(!err){

                        var newNotesThread = new NotesThread({
                            ticketId :req.body.ticketId,
                            taskId : task._id
                        });

                        newNotesThread.save(function(err ,thread){
                            if(!err){
                                Task.update({_id:task._id},{$set:{notesThread:thread._id}},function(err,newTask){
                                    if(!err){

                                        var from_email = new helper.Email('sravik1010@gmail.com');
                                        var to_email = new helper.Email(req.body.handlerEmail);
                                        var subject = 'Task Assigned';
                                        var content = new helper.Content('text/plain', 'Hello '+req.body.handlerName+' , You have been assigned a task named "'+req.body.name+'" . You can access task through this link : http://apollo-node.herokuapp.com/api/tasks/'+task._id);
                                        var mail = new helper.Mail(from_email, subject, to_email, content);


                                        var sg = require('sendgrid')(config.mail_key);
                                        var request = sg.emptyRequest({
                                        method: 'POST',
                                        path: '/v3/mail/send',
                                        body: mail.toJSON(),
                                        });
                                        sg.API(request, function(error, response) {
                                            res.status(200).send({success :true , data : data});
                                            //res.status(200).send({success : true , msg : "Co Manager Created"});   
                                    });

                                        
                                    }else{
                                        res.status(400).json({success : false , msg : err});
                                    }
                                });
                            }else{
                                res.status(400).json({success : false , msg : err});
                            }
                        });

                        //res.status(200).json({success : true , data : data});
                    }else{
                        res.status(500).json({success : false , msg : err});   
                    }
                });
                //some other task
				//res.status(200).json({success : true , data : data});
			}else{
				res.status(500).json({success : false , msg : err});
			}
		});
	}
});


module.exports = router;