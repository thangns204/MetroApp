var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
var passport = require('passport');
var session = require('express-session');



app.set('view engine', 'ejs');
app.use(express.static("public"));

require('./config/passport.js')(passport);

//DataBase
var mongoose = require('mongoose');
 mongoose.connect('mongodb://localhost:27017/loginDB', function (err) {
  
    if (err) throw err;
  
    console.log('Successfully connected');
  
 });


//Body-parser
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

//init passport
app.use(passport.initialize());
app.use(passport.session());


//init for session

app.use(session({
	secret:'something',
	cookie: {
		maxAge: 1000 * 50 * 5
	}
}));


require('./routes/index.js')(app, passport);

app.listen(3000);