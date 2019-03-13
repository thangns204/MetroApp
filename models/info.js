let mongoose = require('mongoose');

let InforSchema = new mongoose.Schema({
	id: {
		type:Number,
		unique: true,
		required:true,
		trim:true
	},

	indicator: {
		type:String,
		unique: true,
		required:true,
		trim:true
	},
	units: {
		type:String,
		unique:true,
		require:true,
		trim:true
	},
	value: {
		type:Number,
		unique:true,
		require:true,
		trim:true
	},
})

let Infor = mongoose.model('Infor', InforSchema);
module.exports = Infor;

