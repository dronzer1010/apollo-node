var express = require('express');
var router = express.Router();


/* Index Route for ticket */
router.get('/', function(req, res, next) {
  res.render('pages/create_ticket', { title: 'Create Ticket' });
});

module.exports = router;