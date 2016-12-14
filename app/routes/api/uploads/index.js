var express  = require('express');
var router   = express.Router();
var multer   = require('multer');
var path = require('path');

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

module.exports = router;