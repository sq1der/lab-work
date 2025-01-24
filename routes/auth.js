const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const router = express.Router();

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.userId = user._id;
    res.redirect('/todo');
  } else {
    res.send('Неверные данные для входа');
  }
});

router.get('/register', (req, res) => {
  res.render('register'); 
});

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const user = new User({ username, password });
  await user.save();
  res.redirect('/login');
});

router.get('/profile', async (req, res) => {
  try {
      // Предполагается, что userId хранится в сессии
      const userId = req.session.userId;

      if (!userId) {
          return res.redirect('/login');
      }

      // Используем async/await
      const user = await User.findById(userId);

      if (!user) {
          return res.redirect('/login');
      }

      res.render('profile', { user });
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

router.post('/profile', async (req, res) => {
  const { username, password } = req.body;
  try {
      await User.findByIdAndUpdate(req.session.userId, { username, password });
      res.redirect('/profile');
  } catch (err) {
      res.status(500).send('Ошибка при обновлении данных');
  }
});

module.exports = router
