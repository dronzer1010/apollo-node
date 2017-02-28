var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');
var Ticket = require(__base + 'app/models/ticketMaster');
var User = require(__base + 'app/models/userMaster');
var MessageThread = require(__base + 'app/models/messageThreadMaster');
var Event = require(__base + 'app/models/events');
var Task    = require(__base + 'app/models/taskMaster');
var mailer   = require('nodemailer');
var mg       = require('nodemailer-mailgun-transport');
var config = require(__base + 'app/config/database');
var helper = require('sendgrid').mail;


router.post('/' , function(req,res){

    if(!req.body.firstName || !req.body.email || !req.body.location || !req.body.designation ||!req.body.replyByDate || !req.body.ticketType){
        res.status(200).send({success : false , msg : "Invalid parameters"});
    }else{
        var transactionType2 = (req.body.transactionType2)?req.body.transactionType2:null;
        var transactionDocumentType = (req.body.transactionDocumentType)?req.body.transactionDocumentType:null;
        var newTicket = new Ticket({
            firstName : req.body.firstName ,
            lastName : (req.body.lastName)?req.body.lastName :'',
            email : req.body.email ,
            location : req.body.location ,
            designation : req.body.designation ,
            ticketPriority : req.body.ticketPriority,
            ticketNotes : (req.body.ticketNotes)?req.body.ticketNotes : '',
            markDirectTo : (req.body.markDirectTo)?req.body.markDirectTo : null ,
            isPicked : false,
            ticketOwner : null,
            ticketType : req.body.ticketType,
            replyByDate : req.body.replyByDate ,
            transactionalDetails : {
                type : (req.body.ticketType == 'transactionalType')?req.body.transactionType : null ,
                finalDate : (req.body.ticketType == 'transactionalType')?req.body.transactionFinalDate : null,
                newOrExisting : (req.body.ticketType == 'transactionalType')?req.body.transactionNewOrExisting : null,
                transactionType : (req.body.ticketType == 'transactionalType')?transactionType2 : null,
                documentType : (req.body.ticketType == 'transactionalType')?transactionDocumentType : null,
                notes : (req.body.ticketType == 'transactionalType')?req.body.transactionNotes : null,
            },
            litigationalDetails : {
                noticeReceived : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeReceived : null ,
                noticeFrom : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeFrom : null ,
                noticeAgainst : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeAgainst : null ,
                opposingLawyer : (req.body.ticketType == 'litigationalType')?req.body.litigationOpposingLawyer : null ,
                contactAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationContactAddress : null ,
                contactEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationContactEmail : null,
                court : (req.body.ticketType == 'litigationalType')?req.body.litigationCourt : null ,
                counselAppointed : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselAppointed : null ,
                counselAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselAddress : null ,
                counselPhone : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselPhone : null ,
                counselEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationCounselEmail : null,
                courtLocation : (req.body.ticketType == 'litigationalType')?req.body.litigationCourtLocation : null,
                amount : (req.body.ticketType == 'litigationalType')?req.body.litigationAmount : null,
            },
            othersDetails : {
                notes :(req.body.ticketType == 'othersType')?req.body.othersNotes : null,
            },
            attachedDocuments : (req.body.documents)?req.body.documents:[] 

        });


        newTicket.save(function(err , data){
            if(!err){

                var tempThread = new MessageThread({
                    ticketId : data._id
                });
                var tempEvent = new Event({
                    type:'ticket',
                    start : req.body.replyByDate,
                    title : "Ticket : "+data._id,
                    ticketRef : data._id,
                    additionalData: data._id,
                    
                });
                tempEvent.save(function(err,event){
                    if(!err){
                        tempThread.save(function(err , thread){
                            if(!err){
                                Ticket.update({_id:data._id},{$set : {messageThread :thread._id}},function(err,tickt){
                                    if(!err){
                                        var from_email = new helper.Email('sravik1010@gmail.com');
                                            var to_email = new helper.Email(req.body.email);
                                            var subject = 'Ticket Submission Successful';
                                            var content = new helper.Content('text/plain', 'Hello '+req.body.firstName+' , Your ticket has been successfuly submitted . Your Ticket id is '+data._id);
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
                                    res.status(400).send({success:false , msg : err}); 
                                    }
                                });
                            }else{
                                res.status(400).send({success:false , msg : err});
                            }
                        });
                    }else{
                       res.status(400).send({success:false , msg : err}); 
                    }
                });
                
                

                //res.status(200).send({success :true , data : data});
            }else{

                res.status(400).send({success:false , msg : err});
            }
        });
    }

});




//route to get all tickets

router.get('/',function(req,res){
    var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
        Ticket.find( {})
                .populate(populateQuery)
                .exec( function(err,docs){
                if(!err){
                    res.status(200).send({success : true , data : docs});
                }else{
                    res.status(400).send({success : false , msg : err});
                }
            });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    }
});

router.get('/open',function(req,res){
    var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
        Ticket.find( {isPicked:false,markDirectTo:null})
                .populate(populateQuery)
                .exec( function(err,docs){
                if(!err){
                    res.status(200).send({success : true , data : docs});
                }else{
                    res.status(400).send({success : false , msg : err});
                }
            });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    }
});


router.get('/marked',function(req,res){
    var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
        Ticket.find( {isPicked:false,markDirectTo:decoded._id})
                .populate(populateQuery)
                .exec( function(err,docs){
                if(!err){
                    res.status(200).send({success : true , data : docs});
                }else{
                    res.status(400).send({success : false , msg : err});
                }
            });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    }
});




router.put('/pick/:id' , function(req,res){
   var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        

        Ticket.update({_id : req.params.id},{$set:{isPicked:true , ticketOwner:decoded._id}},function(err,data){
                    if(!err){
                            Event.update({ticketRef:req.params.id},{$set:{eventOwner:decoded._id}},function(err,event){
                                if(!err){
                                    res.status(200).send({success : true ,msg : "Ticked Picked"});
                                }else{
                                    res.status(400).send({success : false , msg : err});
                                }
                            });
                    }else{
                        res.status(400).send({success : false , msg : err});
                    }
                });

    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    } 
});

router.put('/close/:id' , function(req,res){
   var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        
        Ticket.findOne({_id : req.params.id},function(err,ticket){
            if(!err){
                ticket.task_list.forEach(function(item){
                        Task.update({_id : item},{$set:{status:'closed'}},function(err,data){
                        if(!err){
                            console.log("Task closed");
                        }else{
                            console.log("Task Not closed");
                        }
                    });
                });
            }
        });
        Ticket.update({_id : req.params.id},{$set:{ticketStatus:'closed'}},function(err,data){
                    if(!err){
                        res.status(200).send({success : true ,msg : "Ticked Closed"});
                    }else{
                        res.status(400).send({success : false , msg : err});
                    }
                });

    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    } 
});




router.get('/mytickets' , function(req,res){
   var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
        Ticket.find({$or:[ {ticketOwner:decoded._id},{ticketCo_Owners :decoded._id} ]})
                .populate(populateQuery)
                .exec( function(err,docs){
                if(!err){
                    res.status(200).send({success : true , data : docs});
                }else{
                    res.status(400).send({success : false , msg : err});
                }
            });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    } 
});





router.post('/mail' , function(req,res){
    sg.API(request, function(error, response) {
        
            res.status(response.statusCode).send({msg:response});   
    });
});



router.get('/comanagers/:id' , function(req,res){
    Ticket.findOne({_id :req.params.id},function(err,data){
        if(!err){
            var temp_arr =data.ticketCo_Owners.slice();
            temp_arr.push(data.ticketOwner);

            User.find({_id : {$nin : temp_arr}},function(err ,users){
                if(!err){
                    res.status(200).send({success : true , data : users});
                }else{
                    res.status(400).send({success : false , msg : err}); 
                }
            });
        
        }else{
           res.status(400).send({success : false , msg : err}); 
        }
    });
});
router.post('/comanagers/:id' , function(req,res){
    console.log("Value of comanager id is "+req.body.comanager);
    if(!req.body.comanager){
        res.status(200).send({success : false , msg : "Invalid parameters"});
    }else{
        Ticket.update({_id:req.params.id},{$push :{ticketCo_Owners:req.body.comanager._id}},function(err,data){
            if(!err){
                var user=req.body.comanager;
                var from_email = new helper.Email('sravik1010@gmail.com');
                var to_email = new helper.Email(user.email);
                var subject = 'Added as Co-Manager';
                var content = new helper.Content('text/plain', 'Hello '+user.firstName+" "+user.lastName+' , You have been made Co-manager to a ticket . Please Login and check ticket in "My Tickets Section" .');
                var mail = new helper.Mail(from_email, subject, to_email, content);


                var sg = require('sendgrid')(config.mail_key);
                var request = sg.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON(),
                });
                sg.API(request, function(error, response) {
        
                    res.status(200).send({success : true , msg : "Co Manager Created"});   
            });
                
            }else{
                res.status(400).send({success : false , msg : err});
            }
        });
    }
});

router.get('/tasks/:id' , function(req,res){
    if(!req.params.id){
        res.status(400).send({success : false , msg : "No Ticket Id provided"});
    }else{
        Ticket.findOne({_id:req.params.id})
              .populate('task_list')
              .select('task_list')
              .exec(function(err,data){
                  if(!err){
                      res.status(200).send({success : true , data : data});
                  }else{
                     res.status(400).send({success : false , msg : err}); 
                  }
              });
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