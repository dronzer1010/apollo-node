var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var jwt      = require('jwt-simple');
var Ticket = require(__base + 'app/models/ticketMaster');
var User = require(__base + 'app/models/userMaster');
var MessageThread = require(__base + 'app/models/messageThreadMaster');
var Document = require(__base + 'app/models/documentMaster');
var Event = require(__base + 'app/models/events');
var Task    = require(__base + 'app/models/taskMaster');
var mailer   = require('nodemailer');
var mg       = require('nodemailer-mailgun-transport');
var config = require(__base + 'app/config/database');
var helper = require('sendgrid').mail;
var CronJob = require('cron').CronJob;
var fs = require('fs');

var Excel = require('node-excel-export');
var aws = require('aws-sdk');





/** Configure AWS *///
aws.config.update({
    secretAccessKey:config.s_k_e_y,
    accessKeyId: config.a_c_k_e_y, 
});

// Instantiate SES.
var ses = new aws.SES({region:'us-west-2'});

router.post('/' , function(req,res){

    if(!req.body.firstName || !req.body.email || !req.body.location || !req.body.designation ||!req.body.replyByDate || !req.body.ticketType){
        res.status(200).send({success : false , msg : "Invalid parameters"});
    }else{

        var attachedDoc=[];

        for(var i=0;i<req.body.documents.length;i++){
            var temp ={};
            console.log(req.body.documents[i]+" ---- "+req.body.fileName[i]);
            var name_arr = req.body.fileName[i].split('**');
            console.log(name_arr);
            temp.url=req.body.documents[i];
            temp.name = name_arr[0];
            temp.key  = name_arr[1];
            attachedDoc.push(temp);
        }

        var additionalDetails = (req.body.transactionAdditionalDetails)?req.body.transactionAdditionalDetails : [];
        console.log;

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
                transactionType : (req.body.ticketType == 'transactionalType')?null : null,
                documentType : (req.body.ticketType == 'transactionalType')?transactionDocumentType : null,
                notes : (req.body.ticketType == 'transactionalType')?req.body.transactionNotes : null,
                additionalDetails : (req.body.ticketType == 'transactionalType')?additionalDetails : null,
            },
            litigationalDetails : {
                litigationType : (req.body.litigationType)?req.body.litigationType:null,
                litigationNonMedicoType :(req.body.litigationNonMedicoType)?((req.body.litigationType == 'non_medico_legal')?req.body.litigationNonMedicoType:null):null,
                noticeReceived : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeReceived : null ,
                noticeFrom : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeFrom : null ,
                noticeAgainst : (req.body.ticketType == 'litigationalType')?req.body.litigationNoticeAgainst : null ,
                opposingLawyer : (req.body.ticketType == 'litigationalType')?req.body.litigationOpposingLawyer : null ,
                contactAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationContactAddress : null ,
                contactEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationContactEmail : null,
                court : (req.body.ticketType == 'litigationalType')?req.body.litigationCourt : null ,
                counselAppointed : (req.body.ticketType == 'litigationalType')?req.body.litigationCouselAppointed : null ,
                counselAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationCouselAddress : null ,
                counselPhone : (req.body.ticketType == 'litigationalType')?req.body.litigationCouselPhone : null ,
                counselEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationCouselEmail : null,
                courtLocation : (req.body.ticketType == 'litigationalType')?req.body.litigationCourtLocation : null,
                amount : (req.body.ticketType == 'litigationalType')?((parseInt(req.body.litigationAmount)!=NaN)?parseInt(req.body.litigationAmount):0) : 0,
            },
            othersDetails : {
                notes :(req.body.ticketType == 'othersType')?req.body.othersNotes : null,
            },
            attachedDocuments :[],
            ticketClosingDate : null,
            ticketOpeningDate : new Date(),

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
                    status : "open"
                    
                });

                attachedDoc.forEach(function(item){


                    var tempDoc = new Document({
                        documentName:item.name,
                        documentKey:item.key,
                        ticketId : data._id,
                        taskId : null,
                        nameOfUser : data.firstName+' '+data.lastName,
                        emailOfUser : data.email,
                        notes : null,
                        documentType : null,
                        documentFileType : null,
                        renewalDate : null,
                        parentDocument: null,
                        relationType : 'parent',
                        documentDescription : null,
                        documentLocation : req.body.location,
                        documentOrigin : 'internal',
                        documentLegalTypeId: null,
                        documentUrl : item.url,
                        notes:null,
                        approved : false,
                        additionalDetails :[],
                        approvalBy:[],
                        approvalDoneBy:null
                        
                    });

                    tempDoc.save(function(err ,doc){
                        if(!err){

                            Ticket.update({_id:data._id},{$push:{attachedDocuments :doc._id }} , function(err, tick){
                                if(!err){
                                    console.log("Document Saved");
                                }else{
                                    console.log("Ticket Not Updated");
                                }
                            });

                            
                        }else{
                            console.log("Error in document creation");
                            console.log(err);
                        }
                    });
                });

                tempEvent.save(function(err,event){
                    if(!err){
                        tempThread.save(function(err , thread){
                            if(!err){
                                Ticket.update({_id:data._id},{$set : {messageThread :thread._id}},function(err,tickt){
                                    if(!err){


                                            var s_email = 'support@ahel-legal.in';
                                            var t_mail = req.body.email;
                                            var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                                            ses_mail = ses_mail + "To: " + t_mail + "\n";
                                            ses_mail = ses_mail + "Subject: Ticket Submission Successful\n";
                                            ses_mail = ses_mail + "MIME-Version: 1.0\n";
                                            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                                            ses_mail = ses_mail + 'Hello '+req.body.firstName+' , Your ticket has been successfuly submitted . Your Ticket id is '+data._id+"\n\n";
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
                                    

                                        */
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



router.put('/edit/:id' , function(req,res){
    var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        console.log(req.body);
       // var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
       
       Ticket.update({_id:req.params.id} ,{$set:{
           firstName : req.body.firstName ,
            lastName : (req.body.lastName)?req.body.lastName :'',
            email : req.body.email ,
            location : req.body.location ,
            designation : req.body.designation ,
            ticketPriority : req.body.ticketPriority,
            ticketNotes : (req.body.ticketNotes)?req.body.ticketNotes : '',
            ticketType : req.body.ticketType,
            replyByDate : req.body.replyByDate ,
            transactionalDetails : {
                type : (req.body.ticketType == 'transactionalType')?req.body.transactionalDetails.type: null ,
                finalDate : (req.body.ticketType == 'transactionalType')?req.body.transactionalDetails.finalDate : null,
                newOrExisting : (req.body.ticketType == 'transactionalType')?req.body.transactionalDetails.newOrExisting : null,
               
                documentType : (req.body.ticketType == 'transactionalType')?req.body.transactionalDetails.documentType : null,
                notes : (req.body.ticketType == 'transactionalType')?req.body.transactionalDetails.notes : null,
                additionalDetails : (req.body.ticketType == 'transactionalType')?req.body.transactionalDetails.additionalDetails : null,
            },
            litigationalDetails : {
                litigationType : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.litigationType:null,
                litigationNonMedicoType :(req.body.ticketType == 'litigationalType')?((req.body.litigationalDetails.litigationType == 'non_medico_legal')?req.body.litigationNonMedicoType:null):null,
                noticeReceived : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.noticeReceived : null ,
                noticeFrom : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.noticeFrom : null ,
                noticeAgainst : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.noticeAgainst : null ,
                opposingLawyer : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.opposingLawyer : null ,
                contactAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.contactAddress : null ,
                contactEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.contactEmail : null,
                court : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.court : null ,
                counselAppointed : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.couselAppointed : null ,
                counselAddress : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.couselAddress : null ,
                counselPhone : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.couselPhone : null ,
                counselEmail : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.couselEmail : null,
                courtLocation : (req.body.ticketType == 'litigationalType')?req.body.litigationalDetails.courtLocation : null,
                amount : (req.body.ticketType == 'litigationalType')?((parseInt(req.body.litigationalDetails.amount)!=NaN)?parseInt(req.body.litigationalDetails.amount):0) : 0,
            },
            othersDetails : {
                notes :(req.body.ticketType == 'othersType')?req.body.othersNotes : null,
            },
           
       }},function(err , data){
           if(!err){
               res.status(200).send({success :true , msg : "Ticket Updated"});
           }else{
               res.status(400).send({success :false , msg : "Ticket Update Failed" , err : err});
           }
       });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    }
});


//

router.put('/nextdate/:id' , function(req,res){
    Ticket.update({_id:req.params.id},{$set:{
        replyByDate : req.body.nextDate
    }} , function(err , data){
        if(!err){
            Event.update({ticketRef:req.params.id},{$set:{
                start : req.body.nextDate
            }} , function(err , data){
                if(!err){
                    res.status(200).send({success :true , msg : "Next Date Updated"}); 
                }else{
                    res.status(400).send({success :false , msg : "Update Failed" , err : err});
                }
            });
        }else{
                res.status(400).send({success :false , msg : "Update Failed" , err : err});
        }
    });
});
//route to get all tickets

router.get('/',function(req,res){
    var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
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


router.get('/indi/:id',function(req,res){
    var token = getToken(req.headers);
    console.log("Iam being called");
    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
        Ticket.findOne( {_id:req.params.id})
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
        var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
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
        var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
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

router.post('/close/:id' , function(req,res){
   var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        
        if(req.body.closingNote){
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
        Ticket.update({_id : req.params.id},{$set:{ticketStatus:'closed' ,ticketClosingDate : new Date(), ticketClosingNote : req.body.closingNote}},function(err,data){
                    if(!err){
                        res.status(200).send({success : true ,msg : "Ticked Closed"});
                    }else{
                        res.status(400).send({success : false , msg : err});
                    }
                });
        }else{

        }

    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    } 
});




router.get('/mytickets' , function(req,res){
   var token = getToken(req.headers);
   console.log("APi Called");
    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];
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
                var s_email = 'support@ahel-legal.in';
                var t_mail = user.email;
                var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                ses_mail = ses_mail + "To: " + t_mail + "\n";
                ses_mail = ses_mail + "Subject: Added as Co-Manager\n";
                ses_mail = ses_mail + "MIME-Version: 1.0\n";
                ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                ses_mail = ses_mail + "--NextPart\n";
                ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                ses_mail = ses_mail + 'Hello '+user.firstName+" "+user.lastName+' , You have been made Co-manager to a ticket . Please Login and check ticket in "My Tickets Section" .'+"\n\n";
                ses_mail = ses_mail + "--NextPart\n";
                ses_mail = ses_mail + "Content-Type: text/plain;\n";

                                            
                var params = {
                        RawMessage: { Data: new Buffer(ses_mail) },
                        Destinations: [ t_mail ],
                        Source: "'Apollo Legal System' <" + s_email + ">'"
                    };
                                            
                ses.sendRawEmail(params, function(err, data) {
                                                if(err) {
                                                    res.status(200).send({success : true , msg : "Co Manager Created" , err:err}); 
                                                } 
                                                else {
                                                    res.status(200).send({success : true , msg : "Co Manager Created"}); 
                                                }           
                                            });






             /*                                   
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
                */
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
 * Excel Export Functionality
 */


router.get('/mytickets/export' , function(req,res){
   var token = getToken(req.headers);

    if(token){
        var decoded = jwt.decode(token, config.secret);
        var populateQuery = [{path:'attachedDocuments'},{path:'designation'},{path:'location'},{path:'task_list'},{path:'ticketCo_Owners'},{path:'transactionalDetails.documentType'},{path:'transactionalDetails.transactionType'}];



      
        var styles = {
            headerDark: {
                fill: {
                fgColor: {
                    rgb: 'FFFFFFFF'
                },
                patternType:"none"
                },
                font: {
                color: {
                    rgb: 'FF000000'
                },
                sz: 12,
                bold: true,
                underline: false
                }
            },
            cellPink: {
                fill: {
                bgColor: {
                    rgb: 'none'

                },
                patternType:"none"
                }
            },
            cellGreen: {
                fill: {
                fgColor: {
                    rgb: 'FF00FF00'
                }
                }
            },
            cellYellow: {
                fill: {
                fgColor: {
                    rgb: 'FFFFFF00'
                }
                }
            },
            cellRed: {
                fill: {
                fgColor: {
                    rgb: 'FFFF0000'
                }
                }
            }
            };



          
            var heading = [
                    [{value: 'a1', style: styles.headerDark}, {value: 'b1', style: styles.headerDark}, {value: 'c1', style: styles.headerDark}],
                   
                ];
            

            var specification = {
                    _id: {
                        displayName: 'Ticket Id',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 // <- width in pixels
                    },
                    firstName: {
                        displayName: 'First Name',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 // <- width in pixels
                    },
                    lastName: {
                        displayName: 'Last Name',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 // <- width in pixels
                    },
                    email: {
                        displayName: 'Email',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 // <- width in pixels
                    },
                    location : {
                        
                        displayName: 'Location',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            return val
                           
                        }
                        

                    },
                    designation: {
                        displayName: 'Designation',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            return val
                           
                        }
                    },
                    ticketPriority: {
                        displayName: 'Priority',
                        headerStyle: styles.headerDark,
                        cellStyle: function(val , row){
                            if(val == '0'){
                                return styles.cellPink;
                            }
                            if(val == '1'){
                                return styles.cellYellow;

                            }
                            if(val == '2'){
                                return styles.cellRed;
                            }

                        }, // <- Cell style
                        cellFormat : function(val , row){
                            if(val == '0'){
                                return 'Low';
                            }
                            if(val == '1'){
                                return 'Medium';
                            }
                            if(val == '2'){
                                return 'High';
                            }
                        },
                        width: 220 , // <- width in pixels,
                        
                    },
                    ticketStatus: {
                        displayName: 'Status',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        
                    
                    cellStyle: function(val , row){
                            if(val == 'open'){
                                return styles.cellGreen;
                            }
                            if(val == 'closed'){
                                return styles.cellRed;

                            }
                            

                        },

                    },
                    ticketNotes: {
                        displayName: 'Notes',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            return val
                           
                        }
                    },
                    ticketType: {
                        displayName: 'Ticket Type',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(val == 'transactionalType'){
                                return 'Transactional';
                            }
                            if(val == 'litigationalType'){
                                return 'Litigational';
                            }
                            if(val == 'othersType'){
                                return 'Others';
                            }
                            if(val==""){
                                return "Nil"
                            }
                           
                        }
                    },
                    tranType: {
                        displayName: 'Transaction Type',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }
                                else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    tranNewOrExisting: {
                        displayName: 'New/Existing',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }
                                else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    tranFinalDate: {
                        displayName: 'Final Date',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    tranDocumentType: {
                        displayName: 'Document Type',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                                return val.legalType;
                            }
                            //return val
                           
                        }
                    },
                    litiType: {
                        displayName: 'Litigational Type',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val=='medico_legal'){
                                    return 'Medico Legal'
                                }
                                if(val == 'non_medico_legal'){
                                    return 'Non-Medico Legal'
                                }
                                if(val == 'tax_related'){
                                    return 'Tax Related'
                                }
                                if(val==""){
                                    return "Nil"
                                }
                            }
                            //return val
                           
                        }

                    },
                    litiNonMedicoType: {
                        displayName: 'Non-Medico Legal Type',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val=='contracts_related'){
                                    return 'Contracts Related'
                                }
                                if(val == 'statutory_compliance'){
                                    return 'Statutory Compliance'
                                }
                                if(val == 'land_matters'){
                                    return 'Land Matters'
                                }
                                if(val == 'labour_related'){
                                    return 'Labour Related'
                                }
                                if(val == 'pharmacy_licenses'){
                                    return 'Pharmacy Licenses'
                                }
                                if(val==""){
                                    return "Nil"
                                }
                            
                            }
                            //return val
                           
                        }

                    },
                    litiNoticeReceived: {
                        displayName: 'Notice Received',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            console.log("Value is "+val);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val=='Y')
                                return 'Yes'

                                if(val == 'N')
                                return 'No'
                                if(val==""){
                                    return "Nil"
                                }
                            }
                            //return val
                           
                        }
                    },
                    litiNoticeFrom: {
                        displayName: 'Notice From',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }
                                else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    litiNoticeAgainst: {
                        displayName: 'Notice Against',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                                    return val;
                            }
                            //return val
                           
                        }
                    },
                    litiOpposingLawyer: {
                        displayName: 'Opposing Lawyer',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    litiContactAddress: {
                        displayName: 'Contact Address',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    litiContactEmail: {
                        displayName: 'Contact Email',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    litiCourt: {
                        displayName: 'Court',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    litiCounselAppointed: {
                        displayName: 'Counsel Appointed',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val=='Y')
                                return 'Yes'

                                if(val == 'N')
                                return 'No'
                                if(val==""){
                                    return "Nil"
                                }
                            }
                            //return val
                           
                        }
                    },

                    litiCounselAddress: {
                        displayName: 'Counsel Address',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    litiCounselEmail: {
                        displayName: 'Counsel Email',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    litiCounselPhone: {
                        displayName: 'Counsel Phone No.',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                                return val;
                            }
                            //return val
                           
                        }
                    },
                    litiCourtLocation: {
                        displayName: 'Court Location',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    litiAmount: {
                        displayName: 'Amount Under Litigation',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                               return val+' INR';
                            }
                            //return val
                           
                        }
                    },
                    ticketOpeningDate: {
                        displayName: 'Opening Date',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    ticketClosingDate: {
                        displayName: 'Closing Date',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    ticketClosingNote: {
                        displayName: 'Closing Notes',
                        headerStyle: styles.headerDark,
                        cellStyle: styles.cellPink, // <- Cell style
                        width: 220 , // <- width in pixels,
                        cellFormat : function(val , row){
                            //console.log(val.name);
                            if(!val){
                                return 'Nil';
                            }else{
                                if(val==""){
                                    return "Nil"
                                }else
                               return val;
                            }
                            //return val
                           
                        }
                    },
                    
                    
                    


                };




        Ticket.find({$or:[ {ticketOwner:decoded._id},{ticketCo_Owners :decoded._id} ]})
                .populate(populateQuery)
                .exec( function(err,docs){
                if(!err){
                    var data_docs=[];
                    docs.forEach(function(doc){
                        var data={};
                        data._id = doc._id;
                        data.firstName = doc.firstName;
                        data.lastName =  doc.lastName;
                        data.email = doc.email;
                        data.location = doc.location.name+' , '+doc.location.division;
                        data.designation = doc.designation.designation;
                        data.ticketPriority = doc.ticketPriority;
                        data.ticketStatus = doc.ticketStatus;
                        data.ticketNotes = doc.ticketNotes;
                        data.ticketType = doc.ticketType;
                        data.tranType = doc.transactionalDetails.type;
                        data.tranNewOrExisting = doc.transactionalDetails.newOrExisting;
                        data.tranFinalDate = doc.transactionalDetails.finalDate;
                        data.tranDocumentType = doc.transactionalDetails.documentType;
                        data.litiType = doc.litigationalDetails.litigationType;
                        data.litiNonMedicoType = doc.litigationalDetails.litigationNonMedicoType;
                        data.litiNoticeReceived = doc.litigationalDetails.noticedReceived;
                        data.litiNoticeFrom = doc.litigationalDetails.noticeFrom;
                        data.litiNoticeAgainst =doc.litigationalDetails.noticeAgainst;
                        data.litiOpposingLawyer = doc.litigationalDetails.opposingLawyer;
                        data.litiContactAddress = doc.litigationalDetails.contactAddress;
                        data.litiContactEmail = doc.litigationalDetails.contactEmail;
                        data.litiCourt = doc.litigationalDetails.court;
                        data.litiCounselAppointed = doc.litigationalDetails.counselAppointed;
                        data.litiCounselAddress = doc.litigationalDetails.counselAddress;
                        data.litiCounselPhone = doc.litigationalDetails.counselPhone;
                        data.litiCounselEmail = doc.litigationalDetails.counselEmail;
                        data.litiCourtLocation = doc.litigationalDetails.courtLocation;
                        data.litiAmount = doc.litigationalDetails.amount;
                        data.ticketClosingNote=doc.ticketClosingNote;
                        data.ticketClosingDate = doc.ticketClosingDate;
                        data.ticketOpeningDate = doc.ticketOpeningDate;

                        data_docs.push(data);
                    });

                    var report = Excel.buildExport(
                        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
                            {
                            name: 'Ticket Details', // <- Specify sheet name (optional)
                            heading: [], // <- Raw heading array (optional)
                            specification: specification, // <- Report specification
                            data: data_docs // <-- Report data
                            }
                        ]
                    );
                   
                    fs.writeFile("report.xls", report,  "binary",function(err) {
                        if(err) {
                            console.log(err);
                        } else {
                             res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                            res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                            res.end(report, 'binary');
                            console.log("The file was saved!");
                        }
                    });
                    //res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
                    //res.send(report);
                    //res.status(200).send({success : true , data : docs});--
                }else{
                    res.status(400).send({success : false , msg : err});
                }
            });
    }else{
        res.status(403).send({success : false , msg : "Token not provided"});
    } 
});






/**
 *  Aggregation For Reports fix
 */


router.post('/report' , function(req,res){


    console.log(req.body);

   var type = req.body.ticketType ;
   console.log(req.body.ticketType);
   var q_date = (req.body.queryDate)?req.body.queryDate : null;
   if(q_date){
        var dateObj = new Date(q_date);
        console.log(dateObj);
        var q_month = dateObj.getUTCMonth(); //months from 1-12
        var q_day = dateObj.getUTCDate();
        var q_year = dateObj.getUTCFullYear();


   }


   if(!type ){

       res.status(400).send({
           success : false ,
           msg : "Invalid Data request"
       });
   }else{

       //Medico Legal Type

       if(type == "medico_legal"){
           if(!q_date){
               Ticket.aggregate([
                {
                    $match : {
                        ticketType : "litigationalType" ,
                        'litigationalDetails.litigationType' : "medico_legal"
                    }            
                },
                {
                    $group :{
                        _id : "_id" ,
                        amount : {
                            $sum : "$litigationalDetails.amount" ,

                        },
                        count : {
                            $sum : 1
                        }
                    }
                }
            ] , function(err , data){
                if(!err){
                    res.status(200).send({
                        success : true ,
                        data : data

                    });
                }else{
                    res.status(400).send({
                        success : false ,
                        err : err
                    });
                }
            });
           }else{




               Ticket.aggregate([
                {
                    $match : {
                        ticketType : "litigationalType" ,
                        'litigationalDetails.litigationType' : "medico_legal",
                        ticketOpeningDate : {$lte : new Date(q_year , q_month , q_day)},
                    }            
                },
                {
                    $group :{
                        type : "litigationalDetails.litigationType" ,
                        amount : {
                            $sum : "$litigationalDetails.amount" ,

                        },
                        count : {
                            $sum : 1
                        }
                    }
                }
            ] , function(err , data){
                if(!err){
                    res.status(200).send({
                        success : true ,
                        data : data

                    });
                }else{
                    res.status(400).send({
                        success : false ,
                        err : err
                    });
                }
            });
           }
       }
//Medico Legal Ends Here
       else if(type == "tax_related"){

           /**
            * Type Tax Related
            */
            if(!q_date){
                 Ticket.aggregate([
                {
                    $match : {
                        ticketType : "litigationalType" ,
                        'litigationalDetails.litigationType' : "tax_related",
                        
                    }            
                },
                {
                    $group :{
                        type : "litigationalDetails.litigationType" ,
                        amount : {
                            $sum : "$litigationalDetails.amount" ,

                        },
                        count : {
                            $sum : 1
                        }
                    }
                }
            ] , function(err , data){
                if(!err){
                    res.status(200).send({
                        success : true ,
                        data : data

                    });
                }else{
                    res.status(400).send({
                        success : false ,
                        err : err
                    });
                }
            });

            }else{
                 Ticket.aggregate([
                {
                    $match : {
                        ticketType : "litigationalType" ,
                        'litigationalDetails.litigationType' : "tax_related",
                        ticketOpeningDate : {$lte : new Date(q_year , q_month , q_day)},
                    }            
                },
                {
                    $group :{
                        type : "litigationalDetails.litigationType" ,
                        amount : {
                            $sum : "$litigationalDetails.amount" ,

                        },
                        count : {
                            $sum : 1
                        }
                    }
                }
            ] , function(err , data){
                if(!err){
                    res.status(200).send({
                        success : true ,
                        data : data

                    });
                }else{
                    res.status(400).send({
                        success : false ,
                        err : err
                    });
                }
            });

            }

            /**
             * End Tax related
             */
       }
       //Non Medico Legal Starts From Here
       else if(type== "non_medico_legal"){
           if(!q_date){
               var sub_type = (req.body.subType)?req.body.subType : "contracts_related";
           console.log(sub_type);
           Ticket.aggregate([
            {
                $match : {
                    ticketType : "litigationalType" ,
                    'litigationalDetails.litigationType' : "non_medico_legal",
                    'litigationalDetails.litigationNonMedicoType' : sub_type,
                    
                }            
            },
            {
                $group :{
                    subtype : "litigationalDetails.litigationNonMedicoType" ,
                    amount : {
                        $sum : "$litigationalDetails.amount" ,

                    },
                    count : {
                        $sum : 1
                    }
                }
            }
        ] , function(err , data){
            if(!err){
                res.status(200).send({
                    success : true ,
                    data : data

                });
            }else{
                res.status(400).send({
                    success : false ,
                    err : err
                });
            }
        });
           }else{
               var sub_type = (req.body.subType)?req.body.subType : "contracts_related";
           console.log(sub_type);
           console.log(q_year+" / "+q_month+" / "+q_day);
           console.log(new Date(q_year , q_month , q_day));
           Ticket.aggregate([
            {
                $match : {
                    ticketType : "litigationalType" ,
                    'litigationalDetails.litigationType' : "non_medico_legal",
                    'litigationalDetails.litigationNonMedicoType' : sub_type,
                    ticketOpeningDate : {$lte : new Date(q_year , q_month , q_day)},
                }            
            },
            {
                $group :{
                    subtype : "litigationalDetails.litigationNonMedicoType" ,
                    amount : {
                        $sum : "$litigationalDetails.amount" ,

                    },
                    count : {
                        $sum : 1
                    }
                }
            }
        ] , function(err , data){
            if(!err){
                res.status(200).send({
                    success : true ,
                    data : data

                });
            }else{
                res.status(400).send({
                    success : false ,
                    err : err
                });
            }
        });
           }
       }
       


   }
    
    
});

router.get('/some' , function(req,res){
    var date = new Date(req.query.date);
    console.log(date.getDate()+" / "+date.getMonth()+' / '+date.getFullYear());
    Ticket.aggregate([
        {
            $match:{
                ticketStatus : 'open'
            }
        },
        {
            $project:{
                year: { $year: "$replyByDate" },
                month: { $month: "$replyByDate" },
                day: { $dayOfMonth: "$replyByDate" },
                ticketOwner :1,
                ticketCo_Owners :1
            }
        },{
            $match:{
                year:date.getFullYear() ,
                month: date.getMonth()+1,
                day: date.getDate()
            }
        }

    ],function(err,data){
        if(!err){
                res.status(200).send({
                    success : true ,
                    data : data

                });
            }else{
                res.status(400).send({
                    success : false ,
                    err : err
                });
            }
    });
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




/**Ticket ron Jobs */
new CronJob('00 00 09 * * 0-6', function() {
   var currDate = new Date();

   var monthAheadDate = new Date(currDate.setMonth(currDate.getMonth()+1));
   Ticket.aggregate([
        {
            $match:{
                ticketStatus : 'open',
                isPicked : true
            }
        },
        {
            $project:{
                year: { $year: "$replyByDate" },
                month: { $month: "$replyByDate" },
                day: { $dayOfMonth: "$replyByDate" },
                ticketOwner :1,
                ticketCo_Owners :1,
                ticketNotes : 1
            }
        },{
            $match:{
                year:monthAheadDate.getFullYear() ,
                month: monthAheadDate.getMonth()+1,
                day: monthAheadDate.getDate()
            }
        }

    ],function(err,data){
        if(!err){
               data.forEach(function(ticket){
                   console.log(ticket);
                   User.findOne({_id:ticket.ticketOwner},function(err,user){
                       if(!err){
                            var s_email = 'support@ahel-legal.in';
                                            var t_mail = user.email;
                                            var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                                            ses_mail = ses_mail + "To: " + t_mail + "\n";
                                            ses_mail = ses_mail + "Subject: Pending Ticket (1 Month remaining)\n";
                                            ses_mail = ses_mail + "MIME-Version: 1.0\n";
                                            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                                            ses_mail = ses_mail + 'Hello '+user.firstName+' ,\n Your ticket is pending  . Your Ticket id is '+ticket._id+'\n , Ticket Notes : '+ticket.ticketNotes+"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/plain;\n";

                                            
                                            var params = {
                                                RawMessage: { Data: new Buffer(ses_mail) },
                                                Destinations: [ t_mail ],
                                                Source: "'Apollo Legal System' <" + s_email + ">'"
                                            };
                                            
                                            ses.sendRawEmail(params, function(err, data) {
                                                if(err) {
                                                    console.log(err);
                                                } 
                                                else {
                                                    console.log(data);
                                                }           
                                            });   
                       }
                   });
               }); 
            }else{
               
            }
    });

}, null, true, 'Asia/Kolkata');



//!5 days
new CronJob('00 00 09 * * 0-6', function() {
   var currDate = new Date();

   var monthAheadDate = new Date(currDate.setDate(currDate.getDate()+15));
   Ticket.aggregate([
        {
            $match:{
                ticketStatus : 'open',
                isPicked : true
            }
        },
        {
            $project:{
                year: { $year: "$replyByDate" },
                month: { $month: "$replyByDate" },
                day: { $dayOfMonth: "$replyByDate" },
                ticketOwner :1,
                ticketCo_Owners :1,
                ticketNotes : 1
            }
        },{
            $match:{
                year:monthAheadDate.getFullYear() ,
                month: monthAheadDate.getMonth()+1,
                day: monthAheadDate.getDate()
            }
        }

    ],function(err,data){
        if(!err){
               data.forEach(function(ticket){
                   console.log(ticket);
                   User.findOne({_id:ticket.ticketOwner},function(err,user){
                       if(!err){
                            var s_email = 'support@ahel-legal.in';
                                            var t_mail = user.email;
                                            var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                                            ses_mail = ses_mail + "To: " + t_mail + "\n";
                                            ses_mail = ses_mail + "Subject: Pending Ticket (15 days remaining)\n";
                                            ses_mail = ses_mail + "MIME-Version: 1.0\n";
                                            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                                            ses_mail = ses_mail + 'Hello '+user.firstName+' ,\n Your ticket is pending  . Your Ticket id is '+ticket._id+'\n , Ticket Notes : '+ticket.ticketNotes+"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/plain;\n";

                                            
                                            var params = {
                                                RawMessage: { Data: new Buffer(ses_mail) },
                                                Destinations: [ t_mail ],
                                                Source: "'Apollo Legal System' <" + s_email + ">'"
                                            };
                                            
                                            ses.sendRawEmail(params, function(err, data) {
                                                if(err) {
                                                    console.log(err);
                                                } 
                                                else {
                                                    console.log(data);
                                                }           
                                            });   
                       }
                   });
               }); 
            }else{
               
            }
    });

}, null, true, 'Asia/Kolkata');



/** 7 Days */
new CronJob('00 00 09 * * 0-6', function() {
   var currDate = new Date();

   var monthAheadDate = new Date(currDate.setDate(currDate.getDate()+7));
   Ticket.aggregate([
        {
            $match:{
                ticketStatus : 'open',
                isPicked : true
            }
        },
        {
            $project:{
                year: { $year: "$replyByDate" },
                month: { $month: "$replyByDate" },
                day: { $dayOfMonth: "$replyByDate" },
                ticketOwner :1,
                ticketCo_Owners :1,
                ticketNotes : 1
            }
        },{
            $match:{
                year:monthAheadDate.getFullYear() ,
                month: monthAheadDate.getMonth()+1,
                day: monthAheadDate.getDate()
            }
        }

    ],function(err,data){
        if(!err){
               data.forEach(function(ticket){
                   console.log(ticket);
                   User.findOne({_id:ticket.ticketOwner},function(err,user){
                       if(!err){
                            var s_email = 'support@ahel-legal.in';
                                            var t_mail = user.email;
                                            var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                                            ses_mail = ses_mail + "To: " + t_mail + "\n";
                                            ses_mail = ses_mail + "Subject: Pending Ticket (7 days remaining)\n";
                                            ses_mail = ses_mail + "MIME-Version: 1.0\n";
                                            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                                            ses_mail = ses_mail + 'Hello '+user.firstName+' ,\n Your ticket is pending  . Your Ticket id is '+ticket._id+'\n , Ticket Notes : '+ticket.ticketNotes+"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/plain;\n";

                                            
                                            var params = {
                                                RawMessage: { Data: new Buffer(ses_mail) },
                                                Destinations: [ t_mail ],
                                                Source: "'Apollo Legal System' <" + s_email + ">'"
                                            };
                                            
                                            ses.sendRawEmail(params, function(err, data) {
                                                if(err) {
                                                    console.log(err);
                                                } 
                                                else {
                                                    console.log(data);
                                                }           
                                            });   
                       }
                   });
               }); 
            }else{
               
            }
    });

}, null, true, 'Asia/Kolkata');

module.exports = router;