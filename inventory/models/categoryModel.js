const joi = require('joi');
const mongoose = require('mongoose'), Schema = mongoose.Schema;

// const itemSchema = new mongoose.Schema({
//     itemName: String,
//     itemCount: Number
// })
// const ItemSchema = mongoose.model('ItemSchema', itemSchema)
// constItemSchema = mongoose.model('ItemSchema', itemSchema).schema;
const categorySchema = new mongoose.Schema({
    name: String,
    itemCount: { type: Number, default: 0 },
    items: [{}],
    categoryId: String
})

const Category = mongoose.model('Category', categorySchema);

module.exports = { Category };

