let mongoose = require('mongoose');

let TicketSchema = new mongoose.Schema({
	id: {
		type:Number,
		unique: true,
		required:true,
		trim:true
	},

	type: {
		type:String,
		unique: true,
		required:true,
		trim:true
	},
	properties: {
		duration: {
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
		}
	}
})

let Ticket = mongoose.model('Ticket', TicketSchema);
module.exports = Ticket;

