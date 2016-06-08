var express = require('express');
var router = express.Router();
var jwt = require("jsonwebtoken");
var Project = require('../models/Project.js');
var Board = require('../models/Board.js');


router.use(function(req, res, next) {
  var token = req.headers['Authorization'] || req.headers['authorization'];
  if (token) {
    jwt.verify(token, "supersecret", function(err, decoded) {
      if (err) { return res.json({ success: false, message: 'Failed to authenticate token.', err: err }); }
      else {
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
  Project.find({ $or:[{creator: req.decoded._id}, {users: { $in: [req.decoded._id] }}] }, function(err, projects){
    if(err){
      return res.status(500).json(err);
    }
    res.json({ projects: projects });
  })
});

// Rota para criar novos projetos
router.post('/', function(req, res) {
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
  project.save(function(err, proj) {
    if(err){
      return res.status(500).json({error: err});
    }
    res.json({ project: proj });
  });

});

// Rota para atualizar projeto
router.put('/:id', function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){ return res.status(500).json(err); }
    if(project === null || project === undefined){ return res.status(404).send({ success: false, message: 'Project not found.' }); }
    project.name = req.body.name;
    project.description = req.body.description;
    project.boards = req.body.boards;
    project.save(function(err, proj) {
      if(err){ return res.status(500).json({error: err}); }
      res.json({ project: proj });
    });

  });
});

// Rota para retornar um projeto pelo seu _id
router.get('/:id', function(req, res) {
  Project.findById(req.params.id, function(err, project){
    if(err){ return res.status(500).json(err); }
    res.json({ project: project });
  })
});

module.exports = router;