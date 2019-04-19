let mongoose = require('mongoose');

let MetroSchema = new mongoose.Schema({
	
	indicator: {
		type:String,
		required:true,
		trim:true
	},
	units: {
		type:String,
		require:true,
		trim:true
	},
	value: {
		type:Number,
		require:true,
		trim:true
	},
})

let Metro = mongoose.model('Metro', MetroSchema);
module.exports = Metro;

