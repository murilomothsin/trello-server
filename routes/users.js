var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require('../models/User.js');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


router.post('/login', function(req, res, next) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      res.status(500).send({ type: false, data: "Error occured: " + err });
      return ;
    }
    // No user found with that username
    if (!user) {
      res.status(400).send({ type: false, data: "Invalid email/password." });
      return ;
    }

    // Make sure the password is correct
    user.verifyPassword(req.body.password, function(err, isMatch) {
      if (err) {
        res.status(400).send({ type: false, data: "Invalid email/password." });
        return ;
      }

      // Password did not match
      if (!isMatch) {
        res.status(400).send({ type: false, data: "Invalid email/password." });
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
    res.status(400).send({ type: false, data: "Invalid data." });
  }
  User.findOne({email: req.body.email}, function(err, user) {
    if (err) {
      res.status(500).send({ type: false, data: "Error occured: " + err });
      return ;
    }
    if (user) {
      res.status(406).send({ type: false, data: "User already exists!"});
      return ;
    }
    var userModel = new User(req.body);
    console.log(req.body);
    console.log(userModel);
    // userModel.email = req.body.email;
    // userModel.name = req.body.name;
    // userModel.password = req.body.password;
    userModel.save(function(err, user) {
      console.log(err);
      console.log(user);
      res.json({ type: true, data: user });
      // user.token = jwt.sign(user, app.get('SECRET'), {expiresInMinutes: 1440});
      // user.save(function(err, user1) {
      //   res.json({ type: true, data: user1, token: user1.token });
      // });
    });
  });
});


module.exports = router;
