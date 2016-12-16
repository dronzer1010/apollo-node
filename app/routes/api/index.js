var express = require('express');
var router  = express.Router();


router.use('/designations' , require('./designations'));

router.use('/locations' , require('./locations'));

router.use('/users' , require('./users'));

router.use('/upload' , require('./uploads'));

router.use('/tickets' , require('./tickets'));

router.use('/documents',require('./documentTemplate'));

router.get('/' , function(req,res){
	res.send('api routes here');
});


module.exports = router;