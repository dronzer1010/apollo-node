var express  = require('express');
var router   = express.Router();
var multer   = require('multer');
var path = require('path');

var Task    = require(__base + 'app/models/taskMaster');

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
           
                     res.status(200).send({
                      success : true ,
                      path : '/docs/'+req.file.filename
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

         Task.update({_id:req.params.id},{$push:{attachedDocuments :'/docs/'+req.file.filename }},function(err,data){
           if(!err){
             res.status(200).send({
                      success : true ,
                      path : '/docs/'+req.file.filename
                });
           }else{
              res.end("Error uploading file." , err);
           }
         });

        }
    });
}); 

module.exports = router;