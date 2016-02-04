var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({type: true, data: "Hello stranger!"});
});

module.exports = router;
