var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var Project = require('../models/Project.js');


router.use(function(req, res, next) {
  console.log(req.headers);
  var token = req.headers['Authorization'] || req.headers['authorization'];
  if (token) {
    jwt.verify(token, "supersecret", function(err, decoded) {
      if (err) { return res.json({ success: false, message: 'Failed to authenticate token.', err: err }); }
      else {
        console.log(decoded);
        req.decoded = decoded;
        next();
      }
    });
  } else {
    return res.status(403).send({ success: false, message: 'No token provided.' });
  }
});

// define the home page route
router.get('/', function(req, res) {
  Project.find({creator: req.decoded._id, users: { $in: [req.decoded._id] } }, function(err, projects){
    if(err){
      res.status(500).json(err);
      return ;
    }
    res.json({type: true, data: projects});
  })
});
// define the about route
router.get('/about', function(req, res) {
  res.send('About birds');
});

module.exports = router;