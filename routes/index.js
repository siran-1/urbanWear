var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  
  res.render('login', { title: 'UrbanWear Login' });
});

module.exports = router;
