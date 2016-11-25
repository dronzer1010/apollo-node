var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('pages/create_user', { title: 'User Signup' });
});

module.exports = router;
