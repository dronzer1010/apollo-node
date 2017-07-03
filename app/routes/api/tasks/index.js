var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

//Get Required Model
var jwt      = require('jwt-simple');
var Task    = require(__base + 'app/models/taskMaster');
var Ticket   = require(__base + 'app/models/ticketMaster');
var NotesThread = require(__base + 'app/models/notesThreadMaster');
var Event = require(__base + 'app/models/events');
var config      = require(__base + 'app/config/database');
var helper = require('sendgrid').mail;


var aws = require('aws-sdk');





/** Configure AWS *///
aws.config.update({
    secretAccessKey:config.s_k_e_y,
    accessKeyId: config.a_c_k_e_y, 
});

// Instantiate SES.
var ses = new aws.SES({region:'us-west-2'});

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
            ticketId:req.body.ticketId,
            attachedDocuments :[]
		});

		newTask.save(function(err ,task){
			if(!err){
                Ticket.update({_id:req.body.ticketId},{$push:{task_list : task._id}}, function(err,data){
                    if(!err){

                        var newNotesThread = new NotesThread({
                            ticketId :req.body.ticketId,
                            taskId : task._id
                        });
                        var tempEvent = new Event({
                            type:'task',
                            start : req.body.completionDate,
                            title : 'Task : '+req.body.name,
                            taskRef : task._id,
                            eventOwner : req.body.master,
                            additionalData: task._id,
                            status : "open"
                        });
                        tempEvent.save(function(err,event){
                            if(!err){
                                newNotesThread.save(function(err ,thread){
                                    if(!err){
                                        Task.update({_id:task._id},{$set:{notesThread:thread._id}},function(err,newTask){
                                            if(!err){


                                                var s_email = 'support@ahel-legal.in';
                                            var t_mail = req.body.handlerEmail;
                                            var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                                            ses_mail = ses_mail + "To: " + t_mail + "\n";
                                            ses_mail = ses_mail + "Subject: Task Assigned\n";
                                            ses_mail = ses_mail + "MIME-Version: 1.0\n";
                                            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                                            ses_mail = ses_mail + 'Hello '+req.body.handlerName+' , You have been assigned a task named "'+req.body.name+'" . You can access task through this link : http://www.ahel-legal.in/#/task-detail/'+task._id+"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/plain;\n";

                                            
                                            var params = {
                                                RawMessage: { Data: new Buffer(ses_mail) },
                                                Destinations: [ t_mail ],
                                                Source: "'Apollo Legal System' <" + s_email + ">'"
                                            };
                                            
                                            ses.sendRawEmail(params, function(err, data) {
                                                if(err) {
                                                    res.status(200).send({success :true , data : data , err: err});
                                                } 
                                                else {
                                                    res.status(200).send({success :true , data : data});
                                                }           
                                            });



                                                /*

                                                var from_email = new helper.Email('sravik1010@gmail.com');
                                                var to_email = new helper.Email(req.body.handlerEmail);
                                                var subject = 'Task Assigned';
                                                var content = new helper.Content('text/plain', 'Hello '+req.body.handlerName+' , You have been assigned a task named "'+req.body.name+'" . You can access task through this link : http://apollo-node.herokuapp.com/#/task-detail/'+task._id);
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
*/
                                                
                                            }else{
                                                res.status(400).json({success : false , msg : err});
                                            }
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



router.get('/:id',function(req,res){
    var populateQuery = [{path:'taskMaster'},{path:'ticketId'},{path:'taskHandlerLocation'},{path:'attachedDocuments'}];
    Task.findOne({_id:req.params.id})
    .populate(populateQuery)
    .exec(function(err,data){
        if(!err){
            res.status(200).json({success : true , msg : data});
        }else{
            res.status(400).json({success : false , msg : err});
        }
    });
});




router.put('/close/:id' , function(req,res){
   var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        

        Task.update({_id : req.params.id},{$set:{status:'closed'}},function(err,data){
                    Event.update({taskRef:req.params.id},{$set:{status:'close'}},function(err,data){
                        if(!err){
                        res.status(200).send({success : true ,msg : "Task Closed"});
                    }else{
                        res.status(400).send({success : false , msg : err});
                    }
                    });
                });

    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    } 
});



/**
 *  Generic token parsing function
 */
var getToken = function (headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(' ');
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};
module.exports = router;