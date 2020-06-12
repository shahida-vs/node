const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    name: String,
    author: String,
    categoryId: String,
    price: Number
})

const Item = mongoose.model('Item', itemSchema);
module.exports = { Item }