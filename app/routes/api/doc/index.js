var express  = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
var jwt      = require('jwt-simple');
var router   = express.Router();

var Document = require(__base + 'app/models/documentMaster');
var config  = require(__base + 'app/config/database');
//AWS SDK 
var aws =  require('aws-sdk');

/** Configure AWS *///
aws.config.update({
    secretAccessKey:config.s_k_e_y,
    accessKeyId: config.a_c_k_e_y, 
});


/** Configure S3 bucket */
var s3 = new aws.S3({signatureVersion: 'v4'});

// Instantiate SES.
var ses = new aws.SES({region:'us-west-2'});



//Route to get all designations

router.post('/' , function(req,res){

	var fileKey = req.body.key;
    
    var options = {
        Bucket    : 'docload',
        Key    : fileKey,
    };
    Document.findOne({documentKey : fileKey} , function(err , document){
        if(!err){
            if(document){
                if(!document.approved){
                    //Document Not approveds
                    res.attachment(fileKey);

                    var fileStream = s3.getObject(options).createReadStream();
	
                    fileStream.pipe(res);

                }else{
                    //Document is approved
                    res.status(400).send({success:false , error : err ,msg : "Document is archived , Request Needed." });
                }
            }else{
                res.status(400).send({success:false , error : err ,msg : "Document Do Not Exist" });
            }
        }else{
            res.status(400).send({success:false , msg : err});
        }
    });

	
	
});


router.post('/request' , function(req,res){
    var token = getToken(req.headers);
    if(token){
        var decoded = jwt.decode(token, config.secret);
        if(decoded.username){
            var options = {
                Bucket    : 'docload',
                Key    : fileKey,
                Expires: 10
            };
            Document.findOne({documentKey : fileKey} , function(err , document){
                if(!err){
                    if(document){
                        s3.getSignedUrl('getObject', params, function (err, url) {
                            if(!err){
                               res.status(400).send({success:false , error : err ,msg : "Error Generating URL" }); 
                            }else{
                                            var s_email = 'support@ahel-legal.in';
                                            var t_mail = decoded.username;
                                            var ses_mail = "From: 'Apollo Legal System' <" + s_email + ">\n";
                                            ses_mail = ses_mail + "To: " + t_mail + "\n";
                                            ses_mail = ses_mail + "Subject: Document Request Successful\n";
                                            ses_mail = ses_mail + "MIME-Version: 1.0\n";
                                            ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
                                            ses_mail = ses_mail + "--NextPart\n";
                                            ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
                                            ses_mail = ses_mail + 'Hello , Your document request is successfully granted . URL  '+url+'   , Valid for : 10 Minutes'+"\n\n";
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
                                                    res.status(200).send({success :true , data : data , msg : "Document Requested , Check Mail"});
                                                }           
                                            });
                            }
                        });
                    }else{
                        res.status(400).send({success:false , error : err ,msg : "Document Do Not Exist" });
                    }
                }else{
                    res.status(400).send({success:false , msg : err});
                }
            });
        }else{

        }

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