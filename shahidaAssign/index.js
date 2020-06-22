const express = require('express');
const app = express();
const db = require('./middleware/connectDb')
const auth = require('./routes/auth');
const users = require('./routes/users');
const customers = require('./routes/customerRoute');
const movies = require('./routes/movieRoute');
const rental = require('./routes/rentalRoute');

db.connectMongodb();
app.use(express.json());


app.use('/store/users', users);
app.use('/store/auth', auth);
app.use('/store/customers', customers);
app.use('/store/movies', movies);
app.use('/store/rental', rental);

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send("404 - Page Not Found");
})

const server = app.listen(3001, function () {
    console.log("Listening to port 3001");

})

module.exports = server;