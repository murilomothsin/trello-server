var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({data: "Hello stranger!"}).status(500);
});

module.exports = router;
