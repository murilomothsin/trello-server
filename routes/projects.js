var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var Project = require('../models/Project.js');
var Board = require('../models/Board.js');


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
  console.log('Projets...');
  console.log(req.decoded._id);
  Project.find({ $or:[{creator: req.decoded._id}, {users: { $in: [req.decoded._id] }}] }, function(err, projects){
    if(err){
      res.status(500).json(err);
      return ;
    }
    res.json({ projects: projects });
  })
});

// define the home page route
router.post('/', function(req, res) {
  

  console.log(req.body);

  var project = new Project();
  project.name = req.body.name;
  project.description = req.body.description;
  project.creator = req.decoded._id;
  for (i in req.body.boards) {
    board = new Board();
    board.name = req.body.boards[i].name;
    board.creator = req.decoded._id;
    project.boards.push(board);
  }
  console.log(project);

  project.save(function(err, proj) {
    if(err){
      res.status(500).json({error: err})
    }
    console.log(proj);
    res.json({ project: proj });
  });

});

// define the home page route
router.put('/:id', function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){
      res.status(500).json(err);
      return ;
    }
    if(project === null || project === undefined){
      return res.status(404).send({ success: false, message: 'Project not found.' });
    }
    console.log(req.body);
    res.json({ project: project });
    project.name = req.body.name;
    project.description = req.body.description;
    
  });

/*
  var project = new Project();
  project.name = req.body.name;
  project.description = req.body.description;
  project.creator = req.decoded._id;
  for (i in req.body.boards) {
    board = new Board();
    board.name = req.body.boards[i].name;
    board.creator = req.decoded._id;
    project.boards.push(board);
  }
  console.log(project);
  project.save(function(err, proj) {
    if(err){
      res.status(500).json({error: err})
    }
    console.log(proj);
    res.json({ project: proj });
  });
*/

});


router.get('/:id', function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){
      res.status(500).json(err);
      return ;
    }
    res.json({ project: project });
  })
});

module.exports = router;