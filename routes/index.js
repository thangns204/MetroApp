var Post = require('../models/post.js');
var Metro = require('../models/metro.js');
var Price = require('../models/price.js')
var Contact = require('../models/contact.js')
var express = require('express');
const nodemailer = require('nodemailer');




module.exports = function(app, passport, request) {
	app.route('/').get(function(req, res) {
		res.render('login.ejs');
	})



	app.route('/about').get(function (req, res) {
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


	app.route('/news')
		.get((req, res) => {
			Post.find({}).exec((err, result) => {
				if (err) throw err;
				//let x = result.content;
				result.forEach((element) => {
					console.log(element._id);
					let b = new Buffer(element.content, 'base64');
					element.content = b.toString();
				})
				//res.status(200).json({result});
				res.render('news.ejs', {post: result});
			});
		});



	app.route('/news/:id').get((req, res) => {
		Post.findById(req.params.id, (err, result) => {
			console.log(req.params.id);
			if (err) throw err;
			let b = new Buffer(result.content, 'base64');
			result.content = b.toString();
			//res.status(200).json({result});
			res.render('news_single.ejs', {post: result});
		})
	})

	app.route('/addnew').post( (req, res) => {
		let post = new Post(req.body);
		//console.log(req.body);
		post.save()
				.then(item => {
					res.status(200).json({'item': 'item added successfully'});
				})
				.catch(err => {
					console.log(err);
            		res.status(400).send('adding new post failed');
        		});
	})


	app.route('/addinformation').post((req, res) => {
		let metro = new Metro(req.body);
		//console.log(req.body);
		metro.save()
				.then(info => {
					res.status(200).json({'metro': 'infor metro successfully'});
				})
				.catch(err => {
					console.log(err);
            		res.status(400).send('adding new infor metro failed');
        		});
	})

	app.route('/addticket').post( (req, res) => {
		let price = new Price(req.body);
		console.log(req.body);
		price.save()
				.then(ticket => {
					res.status(200).json({'ticket': 'ticket added successfully'});
				})
				.catch(err => {
					console.log(err);
            		res.status(400).send('adding new ticket failed');
        		});
	})


	app.route('/news/list').get((req, res) => {
		Post.find({}).exec((err, result) => {
			if (err) throw err;
						res.render('list_news.ejs', {post: result});
		});
	});
	


	app.route('/profile').get((req, res) => {
		//console.log(user);
        res.render('profile.ejs');
    });

	app.route('/information').get((req, res) => {
		Metro.find({}).exec((err, result) => {
			if (err) throw err;
			//res.status(200).json({result});
			res.render('information.ejs', {infor: result});
		})
	});

	app.route('/ticket').get((req, res) => {
		Price.find({}).exec((err, result) => {
			if (err) throw err;
			//res.status(200).json({result});
			res.render('ticket.ejs', {ticket: result});
		})
	});

	app.route('/contact').get((req, res) => {
		Contact.find({}).exec((err, result) => {
			if (err) throw err;
			//res.status(200).json({result});
			res.render('contact.ejs', {contact: result});
		})
	});

/*
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
*/
	app.route('/maps').get((req, res) => {
		res.render('maps.ejs');
	});

	

	app.route('/feedback').post((req, res) => {
		console.log('body: ' + JSON.stringify(req.body));
		let transporter = nodemailer.createTransport({
 			service: 'gmail',
 			auth: {
        		user: 'dophin204198@gmail.com',
        		pass: 'thang204198'
    		}
		});
		

		const mailOptions = {
  			from: req.body.email, // sender address
  			to: 'thangns204@gmail.com', // list of receivers
  			subject: 'Feedback from user', // Subject line
  			text: `${req.body.name} (${req.body.email}) says: ${req.body.comments} with experience: ${req.body.experience}`// plain text body
		};
		

		transporter.sendMail(mailOptions,  (err, info) => {
   			if (err) {
      			res.send('contact-failure');
      			console.log(err);
    		} else {
      			res.send('contact-success');
    		}
		});
	});


	app.route('/logout').get((req, res) => {
        req.logout();
        res.redirect('/');
    });
	
}