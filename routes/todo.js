const express = require('express');
const Todo = require('../models/Todo');
const router = express.Router();

router.get('/todo', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const todos = await Todo.find({ userId: req.session.userId });
  res.render('todo', { todos });
});

router.post('/todo', async (req, res) => {
  if (!req.session.userId) return res.redirect('/login');
  const todo = new Todo({
    userId: req.session.userId,
    task: req.body.task
  });
  await todo.save();
  res.redirect('/todo');
});



module.exports = router;
