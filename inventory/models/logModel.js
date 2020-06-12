const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    categoryId: String,
    date: { type: Date, default: Date.now },
    item: String,
    operation: String,
    author: String,
    price: Number,
    itemId: Object(String)
})

const Log = mongoose.model('Log', itemSchema);
module.exports = { Log }