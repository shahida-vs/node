const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    phone: { type: Number, required: true, unique: true },
    name: { type: String, required: true, minlength: 5, maxlength: 50 },
    customerId: { type: String, required: true, unique: true }
})

const Customer = mongoose.model('Customer', customerSchema);

module.exports = { Customer };
