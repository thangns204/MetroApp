var express = require('express');
var app = express();
var bodyParser = require('body-parser'); 
var passport = require('passport');
var session = require('express-session');
var request = require('request');

//mail nodejs


app.set('view engine', 'ejs');
app.use(express.static("public"));

require('./config/passport.js')(passport);

//DataBase
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/loginDB", { useNewUrlParser: true }, (err) => {

    if (err) throw err;
//    mongoose.connection.db.listCollections().toArray(function (err, names) {
  //      console.log(names); // [{ name: 'dbname.myCollection' }]
   //     module.exports.Collection = names;
    //});
  
    console.log('Successfully connected');
});

//Will take control of request tarting with path /api



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


require('./routes/index.js')(app, passport, request);

app.listen(3000);