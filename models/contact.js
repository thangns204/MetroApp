let mongoose = require('mongoose');

let ContactSchema = new mongoose.Schema({
	classname: {
		type:String,
		unique: true,
		required:true,
		trim:true
	},
	info: {
		type:String,
		unique:true,
		require:true,
		trim:true
	}
})

let Contact = mongoose.model('Contact', ContactSchema);
module.exports = Contact;

