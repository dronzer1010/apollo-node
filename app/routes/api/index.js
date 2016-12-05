var express = require('express');
var router  = express.Router();


router.use('/designations' , require('./designations'));

router.use('/locations' , require('./locations'));

router.use('/users' , require('./users'));

router.get('/' , function(req,res){
	res.send('api routes here');
});


module.exports = router;