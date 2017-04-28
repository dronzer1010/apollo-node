var express  = require('express');
var router   = express.Router();
var multer   = require('multer');
var config  = require(__base + 'app/config/database');
//AWS SDK 
var aws =  require('aws-sdk');
//Multer for S3
var multerS3 = require('multer-s3') 

var path = require('path');

var Task    = require(__base + 'app/models/taskMaster');
var Document = require(__base + 'app/models/documentMaster');





/** Configure AWS */
aws.config.update({
    secretAccessKey:config.s_k_e_y,
    accessKeyId: config.a_c_k_e_y, 
});


/** Configure S3 bucket */
var s3 = new aws.S3({signatureVersion: 'v4'});

/*
var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__base, '/app/uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({ storage : storage}).single('document');

*/

var upload =   multer({

    storage: multerS3({
        s3: s3,
        bucket: 'docload',
       
        key: function (req, file, cb) {
            console.log(file);
            cb(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname)); //use Date.now() for unique file keys
        }
    })

}).single('document');



router.post('/' , function(req,res ,next){
    upload(req,res,function(err) {
        if(err) {
          console.log(err);
            return res.end("Error uploading file." , err);
        }else{
        // var  tempfile = req.file.path.split('/');
                    console.log(req.file);
                     res.status(200).send({
                      success : true ,
                      path : req.file.location,
                      name : req.file.originalname+'**'+req.file.key
                });
        }
    });
});


router.post('/task/:id' , function(req,res ,next){
    upload(req,res,function(err) {
        if(err) {
          console.log(err);
            return res.end("Error uploading file." , err);
        }else{
         //var  tempfile = req.file.path.split('/');



         var populateQuery = [{path:'taskMaster'},{path:'ticketId'},{path:'taskHandlerLocation'}];
         Task.findOne({_id:req.params.id})
         .populate(populateQuery)
         .exec(function(err,task){
           if(!err){
             console.log(task.ticketId);
             var tempDoc = new Document({
                        documentName:req.file.originalname,
                        documentKey : req.file.key,
                        ticketId : task.ticketId,
                        taskId : task._id,
                        nameOfUser : task.ticketId.firstName,
                        emailOfUser : task.ticketId.email,
                        notes : null,
                        documentType : null,
                        documentFileType : null,
                        renewalDate : null,
                        parentDocument: null,
                        relationType : 'parent',
                        documentDescription : null,
                        documentLocation : task.taskHandlerLocation,
                        documentOrigin : 'internal',
                        documentLegalTypeId: null,
                        documentUrl : req.file.location,
                        notes:null,
                        approved : false,
                        additionalDetails :[],
                        approvalBy:[],
                        approvalDoneBy:null
                        
                    });

                  tempDoc.save(function(err,document){
                    if(!err){
                       Task.update({_id:req.params.id},{$push:{attachedDocuments:document}},function(err,data){
                          if(!err){
                            res.status(200).send({
                                      success : true ,
                                      path : req.file.location,
                                      name : req.file.originalname+'**'+req.file.key
                                });
                          }else{
                              res.status(400).send({success:false , msg : "Error Uploading File" , err : err});
                          }
                        });
                    }else{
                      res.status(400).send({success:false , msg : "Error Uploading File" , err : err});
                    }
                  });
           }else{
             res.status(400).send({success:false , msg : "Error Uploading File" , err : err});
           }
         });


        

        }
    });
}); 

module.exports = router;