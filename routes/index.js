var Paper = require('../models/paper.js');
var Infor = require('../models/info.js');
var Ticket = require('../models/ticket.js')
var Contact = require('../models/contact.js')


module.exports = function(app, passport, request) {
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
		Paper.find({}).exec((err, result) => {
			if (err) throw err;
			res.render('news.ejs', {paper: result});
		});
	});

	app.post('/addnew', (req, res) => {
		let paper = new Paper(req.body);
		//console.log(req.body);
		paper.save()
				.then(item => {
					res.status(200).json({'item': 'item added successfully'});
				})
				.catch(err => {
					console.log(err);
            		res.status(400).send('adding new paper failed');
        		});
	})

	app.post('/addinfo', (req, res) => {
		let info = new Infor(req.body);
		//console.log(req.body);
		info.save()
				.then(info => {
					res.status(200).json({'info': 'info added successfully'});
				})
				.catch(err => {
					console.log(err);
            		res.status(400).send('adding new info failed');
        		});
	})

	app.post('/addticket', (req, res) => {
		let ticket = new Ticket(req.body);
		console.log(req.body);
		ticket.save()
				.then(ticket => {
					res.status(200).json({'ticket': 'ticket added successfully'});
				})
				.catch(err => {
					console.log(err);
            		res.status(400).send('adding new ticket failed');
        		});
	})


	app.get('/news/list', (req, res) => {
		Paper.find({}).exec((err, result) => {
			if (err) throw err;
			res.render('list_news.ejs', {paper: result});
		});
	});
	


	app.get('/profile', function(req, res) {
		//console.log(user);
        res.render('profile.ejs');
    });

	app.get('/information', function(req, res) {
		Infor.find({}).exec((err, result) => {
			if (err) throw err;
			res.render('information.ejs', {infor: result});
		})
	});

	app.get('/ticket', function(req, res) {
		Ticket.find({}).exec((err, result) => {
			if (err) throw err;
			res.render('ticket.ejs', {ticket: result});
		})
	});

	app.get('/contact', function(req, res) {
		Contact.find({}).exec((err, result) => {
			if (err) throw err;
			res.render('contact.ejs', {contact: result});
		})
	});

	app.get('/maps', (req, res) => {
		request("https://yandex.ru/metro/spb",(err, response, body) =>{
			if (err) throw err;
			res.render('maps.ejs',{html:body});
		})
	})

	app.get('/spb', (req, res) => {
		request("https://yandex.ru/metro/spb",(err, response, body) =>{
			if (err) throw err;
			res.render('maps.ejs',{html:body});
		})
	})


	app.get('/logout', (req, res) => {
        req.logout();
        res.redirect('/');
    });
	
}