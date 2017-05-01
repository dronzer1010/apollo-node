var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();
var aws = require('aws-sdk');
//Get Required Model

var Notes    = require(__base + 'app/models/notesMaster');
var Task    = require(__base + 'app/models/taskMaster');
var config      = require(__base + 'app/config/database');

/** Configure AWS *///
aws.config.update({
    secretAccessKey:config.s_k_e_y,
    accessKeyId: config.a_c_k_e_y, 
});


// Instantiate SES.
var ses = new aws.SES({region:'us-west-2'});


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






// Sending RAW email including an attachment.
router.post('/send', function (req, res) {
    var email = "support@ahel-legal.in";
    var t_mail = 'sravik1010@gmail.com';
    var ses_mail = "From: 'AWS Tutorial Series' <" + email + ">\n";
    ses_mail = ses_mail + "To: " + t_mail + "\n";
    ses_mail = ses_mail + "Subject: AWS SES Attachment Example\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "This is the body of the email.\n\n";
    ses_mail = ses_mail + "--NextPart--";
    ses_mail = ses_mail + "Content-Type: text/plain;\n";

    
    var params = {
        RawMessage: { Data: new Buffer(ses_mail) },
        Destinations: [ t_mail ],
        Source: "'AWS Tutorial Series' <" + email + ">'"
    };
    
    ses.sendRawEmail(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        }           
    });
});

module.exports = router;