var express  = require('express');
var mongoose = require('mongoose');
var router   = express.Router();








//Route to get all designations

router.get('/' , function(req,res){
	res.end("something");
});




module.exports = router;