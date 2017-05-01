var express  = require('express');
var mongoose = require('mongoose');
var fs = require('fs');
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




//Route to get all designations

router.get('/:id' , function(req,res){

	var fileKey = req.params.id;
    var options = {
        Bucket    : 'docload',
        Key    : fileKey,
    };
    Document.findOne({documentKey : fileKey} , function(err , document){
        if(!err){
            if(doc){
                if(!doc.approved){
                    //Document Not approved
                    res.attachment(fileKey);

                    var fileStream = s3.getObject(options).createReadStream();
	
                    fileStream.pipe(res);

                }else{
                    //Document is approved

                }
            }else{
                res.status(400).send({success:false , error : err ,msg : "Document Do Not Exist" });
            }
        }else{
            res.status(400).send({success:false , msg : err});
        }
    });

	
	
});




module.exports = router;