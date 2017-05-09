var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/bundle', function(req, res, next) {
  res.render('bundle');
});

module.exports = router;
