var express = require('express');
var router  = express.Router();

router.use('/api' ,require('./api'));

router.get('/ticket' , function(req , res){
	res.sendFile('ticket.html',{ root: __base + 'client' });
});

router.get('*' , function(req , res){
	res.render('index.html');
});

module.exports =router;