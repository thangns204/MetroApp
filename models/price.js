let mongoose = require('mongoose');

let PriceSchema = new mongoose.Schema({
	id: {
		type:Number,
		required:true,
		trim:true
	},

	type: {
		type:String,
		required:true,
		trim:true
	},
	properties: {
		duration: {
			type:String,
			require:true,
			trim:true
		},
		value: {
			type:Number,
			require:true,
			trim:true
		}
	}
})

let Price = mongoose.model('Price', PriceSchema);
module.exports = Price;

