const express = require('express');
const minionsRouter = express.Router();
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
// Minion:
//     id: string
//     name: string
//     title: string
//     salary: number


minionsRouter.get('/', (req, res, next) => {
  res.send(getAllFromDatabase('minions'));
});

minionsRouter.get('/:minionId', (req, res, next) => {
  const minion = getFromDatabaseById('minions', req.params.minionId);
  if (minion !== undefined)
    res.status(200).send(minion);
  else
    res.status(404).send('The requested minion was not found!');
})

minionsRouter.get('/:minionId/work', (req, res, next) => {
  const works = getAllFromDatabase('work').filter(item => item.id === req.params.minionId);
  if (works.length > 0)
    res.send(works);
  else
    res.status(404).send('No such works exists!');
})

minionsRouter.post('/', (req, res, next) => {
  const name = req.body.name;
  const title = req.body.title;
  const salary = Number(req.body.salary);
  const weaknesses = req.body.weaknesses;
  // const minions = getAllFromDatabase('minions');
  const newMinion = addToDatabase('minions', {
    // id: minions.length,
    id: uuidv1(),
    name: name,
    title: title,
    salary: salary,
    weaknesses: weaknesses
  })
  // if (name && title && salary)
  if (newMinion)
    res.status(201).send(newMinion)
  else
    res.status(400).send('The sent request is problematic!');
})

minionsRouter.post('/:minionId/work', (req, res, next) => {
  const newMinion = addToDatabase('work', {
    id: uuidv1(),
    title: req.body.title,
    description: req.body.description,
    hours: req.body.hours || Date.now(),
    minionId: req.params.minionId
  })
  // if (name && title && salary)
  if (newMinion)
    res.status(201).send(newMinion)
  else
    res.status(400).send('The sent request is problematic!');
});

minionsRouter.put('/:minionId', (req, res, next) => {
  const result = updateInstanceInDatabase('minions', {
    id: req.params.minionId,
    name: req.body.name,
    title: req.body.title,
    salary: req.body.salary || 0,
    weaknesses: req.body.weaknesses
  });

  if (result)
    res.status(200).send(result);
  else
    res.status(404).send('The sent request is problematic!');
})

minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
  if (getFromDatabaseById('minions', req.params.minionId) === undefined ||
    getFromDatabaseById('work', req.params.workId) === undefined)
    res.status(404).send('The sent request is problematic!');
  if (getAllFromDatabase('work').filter(work => work.id === req.params.workId &&
    work.minionId === req.params.minionId).length < 1)
    res.status(400).send('The sent request is problematic!');
  const work = updateInstanceInDatabase('work', {
    id: req.params.workId,
    title: req.body.title,
    description: req.body.description,
    hours: req.body.hours,
    minionId: req.params.minionId
  });
  console.log(work);

  if (work)
    res.status(200).send(work);
  else
    res.status(404).send('The sent request is problematic!');
})

minionsRouter.delete('/:minionId', (req, res, next) => {
  if (deleteFromDatabasebyId('minions', req.params.minionId))
    res.status(204).send(`The minion ${req.params.minionId} is deleted.`);
  else
    res.status(404).send('The minion was not found for deletion!');
})

minionsRouter.delete('/:minionId/work/:workId', (req, res, next) => {
  if (deleteFromDatabasebyId('work', req.params.workId))
    res.status(204).send(`The work  is deleted.`);
  else
    res.status(404).send('The work was not found for deletion!');
})


module.exports = minionsRouter;
