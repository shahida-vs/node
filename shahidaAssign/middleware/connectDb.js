const mongoose = require('mongoose');
const config = require('config');

const db = config.get('db')

function connectMongodb() {
    mongoose.connect(db,
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log(`Connected to mongodb ${db}`))
        .catch((err) => console.log('Unable to connect'));

}

module.exports = { connectMongodb }