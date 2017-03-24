var express  = require('express');
var router   = express.Router();
var multer   = require('multer');
var path = require('path');

var Task    = require(__base + 'app/models/taskMaster');
var Document = require(__base + 'app/models/documentMaster');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, path.join(__base, '/app/uploads'));
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now()+path.extname(file.originalname));
  }
});

var upload = multer({ storage : storage}).single('document');

router.post('/' , function(req,res ,next){
    upload(req,res,function(err) {
        if(err) {
          console.log(err);
            return res.end("Error uploading file." , err);
        }else{
         var  tempfile = req.file.path.split('/');
                    console.log(req.file);
                     res.status(200).send({
                      success : true ,
                      path : '/docs/'+req.file.filename ,
                      name : req.file.originalname
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
         var  tempfile = req.file.path.split('/');



         var populateQuery = [{path:'taskMaster'},{path:'ticketId'},{path:'taskHandlerLocation'}];
         Task.findOne({_id:req.params.id})
         .populate(populateQuery)
         .exec(function(err,task){
           if(!err){
             console.log(task.ticketId);
             var tempDoc = new Document({
                        documentName:req.file.originalname,
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
                        documentUrl : '/docs/'+req.file.filename,
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
                                      path : '/docs/'+req.file.filename,
                                      name : req.file.originalname
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