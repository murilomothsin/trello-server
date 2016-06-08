var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require('../models/User.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  User.find({}, function(err, users){
    if(err){
      res.status(500);
    }else{
      res.json({data: users});
    }
  });

});

router.get('/:id', function(req, res, next) {
  User.findById(req.params.id,'_id name email', function(err, user){
    if(err){
      res.status(500);
    }else{
      res.json({user: user});
    }
  });

});

router.post('/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(500).json({ type: false, data: "Error occured: " + err });
      return ;
    }
    // No user found with that username
    if (!user) {
      res.status(400).json({ type: false, data: "Invalid email/password." });
      return ;
    }

    // Make sure the password is correct
    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err) {
        res.status(400).json({ type: false, data: "Invalid email/password." });
        return ;
      }

      // Password did not match
      if (!isMatch) {
        res.status(400).json({ type: false, data: "Invalid email/password." });
        return ;
      }

      // Success
      param = {"_id": user._id, "email": user.email}
      var token = jwt.sign(param, "supersecret");
      user.token = token
      user.save(function(err, user1){
        res.json({ type: true, data: user1, token: user1.token });
      });
    });
  });
});


router.post('/register', function(req, res, next) {
  if (typeof(req.body.name) == "undefined" || typeof(req.body.email) == "undefined" || typeof(req.body.password) == "undefined"){
    res.status(400).json({ type: false, data: "Invalid data." });
  }
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.status(500).json({ type: false, data: "Error occured: " + err });
      return ;
    }
    if (user) {
      res.status(406).json({ type: false, data: "User already exists!"});
      return ;
    }
    var userModel = new User(req.body);
    userModel.save(function(err, user) {
      res.json({ type: true, data: user });
    });
  });
});

router.post('/valid_token', function(req, res, next) {
  User.findOne({token: req.body.token}, function(err, user){
    if(err) { res.status(401).json({ type: false, data: "User not found!"}); return ; }
    if(user) { 
      res.json({type: true, data: user}); return ; 
    }else{
      res.status(401).json({ type: false, data: "User not found!"}); 
      return ;
    }
  });
});

module.exports = router;
