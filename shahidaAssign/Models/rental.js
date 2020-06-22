const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    customerId: { type: String, required: true },
    rentalFee: { type: Number },
    damageCharges: { type: Number, default: 0 },
    movieId: { type: String, required: true },
    dateOut: Date,
    dateReturned: Date,
    totalCharges: { type: Number, default: 0 }
})

const Rental = mongoose.model('Rent', rentalSchema);

module.exports = { Rental };
