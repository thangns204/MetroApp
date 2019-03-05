var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

module.exports = function(passport) {
	passport.serializeUser((username, done) => {
 		done(null, username);
 	})

 	passport.deserializeUser((name, done) => {
 		if (name == 'user') {
 			return done(null, name)
 		} else {
 			return done(null, false);
 		}
 	})

 	passport.use('login',new LocalStrategy(
 		(username, password, done) => {
 			User.findOne({
 				username: username
 			}, (err, user) => {
 				if (err) {
 					return done(err);
 				}

 				if (!user) {
 					return done(null, false);
 				}

 				if (user.password != password) {
 					return done(null, false);
 				}
 				return done(null, user);
 			});
 		}
 	));


 	passport.use('signup', new LocalStrategy(
 		(username, password,  done) => {
 			User.findOne({
 				username: username
 			}, (err, user) => {
 				if (err) {
 					return done(err);
 				} 

 				if (user) {
 					return done(null, false);
 				}

 				var newUser = new User();
 				newUser.username = username;
 				newUser.password = password;
 				newUser.save((err) => {
 					if (err) throw err;
 					return done(null, newUser);
 				})
 			})
 		}
 	))
}