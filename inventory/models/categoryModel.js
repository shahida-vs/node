const joi = require('joi');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
    name: String,
    itemCount: { type: Number, default: 0 },
    items: [{}],
    categoryId: String
})

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };

