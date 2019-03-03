var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('view engine', 'ejs');

require('./routes/index.js')(app);


//DataBase
var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost:27017/loginDB', function (err) {
  
    if (err) throw err;
  
    console.log('Successfully connected');
  
 });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json())




// POST /login gets urlencoded bodies
app.post('/signup', function (req, res) {
  if (!req.body) return res.sendStatus(400)
  res.send('welcome, ' + req.body);
})

app.listen(3000);