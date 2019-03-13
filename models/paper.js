	let mongoose = require('mongoose');

let PaperSchema = new mongoose.Schema({
	id: {
		type:Number,
		unique: true,
		required:true,
		trim:true
	},

	author: {
		type:String,
		unique: true,
		required:true,
		trim:true
	},
	title: {
		type:String,
		unique:true,
		require:true,
		trim:true
	},
	content: {
		type:String,
		unique:true,
		require:true,
		trim:true
	},
	
	key: {
		type:Number,
		unique:true,
		require:true,
		trim:true
	},

	image: {
		type:String,
		unique:true,
		require:true,
		trim:true
	},	
})

let Paper = mongoose.model('Paper', PaperSchema);
module.exports = Paper;

