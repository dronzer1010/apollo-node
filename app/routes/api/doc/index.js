var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();

var Document = require(__base + 'app/models/documentMaster');
var config  = require(__base + 'app/config/database');
//AWS SDK 
var aws =  require('aws-sdk');

/** Configure AWS */
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
	res.attachment(fileKey);

    var fileStream = s3.getObject(options).createReadStream();
	
    fileStream.pipe(res);
});




module.exports = router;