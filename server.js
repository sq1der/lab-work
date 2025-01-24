const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');

const app = express();

app.get('/', (req, res) => {
    res.render('index');
  });
  
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

const dbURI = 'mongodb+srv://aman:0909@cluster0.asuht.mongodb.net/Cluster0?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(dbURI, {
    dbName: 'Cluster0', 
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(session({
  secret: '0909', 
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
    mongoUrl: dbURI, 
    collectionName: 'sessions', 
  }),
}));

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const todoRoutes = require('./routes/todo');
app.use('/', todoRoutes);

// Подключение маршрутов
app.use('/', authRoutes);


app.use(express.static('public'));

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
