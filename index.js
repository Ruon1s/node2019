'use strict';

const express = require('express');
const animal = require('./model/animal');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const app = express();

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({extended: true}));
app.use(require('express-session')({secret: 'keyboard cat', resave: true, saveUninitialized: true }));

if(process.env.SERVER === 'dev_localhost') {
  require('./secure/localhost')(app);
} else {
  require('./secure/server')(app);
  app.listen(3000, () => {
    console.log('server app start?');
  });
}

passport.use(new LocalStrategy(
    (username, password, done) => {
      console.log('login', username);
  if(username !== 'test' || !bcrypt.compareSync(password, '$2a$12$Cdo1wfDRQZM/tlbGLR3AtuplXIFkzn5FdRgCl5LFpks1VXJ02Dyvy')) {
    console.log('login', 'wrong username or password');
    return done(null, false);
  }
    return done(null, {username: username});
  }));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((username, done) => {
  /* User.findById(id, function (err, user) {
  done(err, user); */
  done(null, {username: username});
});


app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'},
    (req, res) => {
      res.redirect('/');
    }));

app.post('/register', (req, res) => {
  const salt = bcrypt.genSaltSync(12);
  const hash = bcrypt.hashSync(req.body.password, salt);
  //insert into user (name, email, password) values (?, ?, ?), [ req.body.name, req.body.email, hash]
  console.log('NEVER DO THAT', hash);
  res.send('account successfully created');
});

const bodyParser = require('body-parser');

app.use(express.static('public'));


app.get('/animals', async (req, res) => {
  try {
    res.json(await animal.getAll());
  } catch (e) {
    console.log(e);
    res.send('db error :(');
  }
});

app.get('/animal', async (req, res) => {
  console.log(req.query);
  try {
    res.json(await animal.search(req.query.name));
  } catch(e) {
    res.send(`db error`);
  }
});

app.post('/animal', bodyParser.urlencoded({extended: true}), async (req, res) => {
  console.log(req.body);
  try {
    res.json(await animal.insert(req.body.name));
  } catch (e) {
    console.log(e);
    res.send('db error');
  }
});

app.get('/', (req, res) => {
  if(req.secure){
    res.send('hello secure')
  } else {
    res.send('Hello form my Node server');
  }
});

app.get('/demo', (req, res) => {
  console.log('request', req);
  res.send('demo');
});
