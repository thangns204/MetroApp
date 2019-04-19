let mongoose = require('mongoose');

let PostSchema = new mongoose.Schema({
	author: {
		type:String,
		required:true,
		trim:true
	},
	title: {
		type:String,
		require:true,
		trim:true
	},
	content: {
		type:String,
		require:true,
		trim:true
	},
	
	key: {
		type:Number,
		require:true,
		trim:true
	},

	image: {
		type:String,
		require:true,
		trim:true
	},	
})

let Post = mongoose.model('Post', PostSchema);
module.exports = Post;

