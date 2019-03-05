var User = require('../models/paper.js');

module.exports = function(app, passport) {
	app.get('/', function(req, res) {
		res.render('index.ejs');
	})



	app.get('/about', function (req, res) {
  		res.send('About this wiki');
	})

	app.route('/login')
	.get((req, res) => res.render('login.ejs'))
	.post(passport.authenticate('login', { //use method passport-local
		failureRedirect: '/login',// if check fail, refresh page login
		successRedirect: '/news'
	}));

	app.route('/signup')
	.get((req, res) => res.render('signup.ejs'))
	.post(passport.authenticate('signup', { //use method passport-local
		failureRedirect: '/signup',// if check fail, refresh page login
		successRedirect: '/profile'
	}));


	app.get('/news', (req, res) => {
		res.render('news.ejs');
	});

	app.get('/news/list', (req, res) => {
		res.render('list_news.ejs', (req, res) => {
			var 
		});
	})


	app.get('/profile', function(req, res) {
		//console.log(user);
        res.render('profile.ejs');
    });


	app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
	
}