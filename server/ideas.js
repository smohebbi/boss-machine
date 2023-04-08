const express = require('express');
const ideasRouter = express.Router();
const checkMillionDollarIdea = require('./checkMillionDollarIdea');
const {
    createMeeting,
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
    deleteAllFromDatabase,
  } = require('./db');
const { 
    v1: uuidv1
  } = require('uuid');

// 'minions', 'ideas', 'meetings', or 'work'
// Idea

//     id: string
//     name: string
//     description: string
//     numWeeks: number
//     weeklyRevenue: number


ideasRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'));
});

ideasRouter.get('/:ideaId', (req, res, next) => {
    const idea = getFromDatabaseById('ideas', req.params.ideaId);
    if(idea !== undefined) 
      res.send(idea);
    else
      res.status(404).send('The requested idea was not found!');
})

ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;
    const numWeeks = Number(req.body.numWeeks);
    const weeklyRevenue = Number(req.body.weeklyRevenue);
    const result = addToDatabase('ideas', { 
      id: uuidv1(),
      name: name,
      description: description,
      numWeeks: numWeeks,
      weeklyRevenue: weeklyRevenue
    })
    if(result) 
      res.status(201).send(result);
    else
      res.status(400).send('The sent request is problematic!');    
})

ideasRouter.put('/:ideaId', (req, res, next) => {
    const result = updateInstanceInDatabase('ideas', {
        id: req.params.ideaId,
        name: req.body.name,
        description: req.body.description,
        numWeeks: req.body.numWeeks,
        weeklyRevenue: req.body.weeklyRevenue
      });
      if(result)
        res.send(result);
      else
        res.status(404).send('The sent request is problematic!');
})

ideasRouter.delete('/:ideaId', (req, res, next) => {
    if(deleteFromDatabasebyId('ideas', req.params.ideaId)) 
      res.status(204).send(`The idea ${req.params.ideaId} is deleted.`);
    else
      res.status(404).send('The ideaId was not found for deletion!');
})

module.exports = ideasRouter;
