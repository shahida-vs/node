const express = require('express');
const app = express();
const itemsDb = require('./routes/items');
const categoryDb = require('./routes/categories');
const trackDb = require('./routes/tracker');

app.use(express.json());
app.use('/inventory/categories', categoryDb)
app.use('/inventory/items', itemsDb)
app.use('/inventory/logs', trackDb)

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send("404 - Page Not Found")
})

app.listen(3011, function () {
    console.log("Listening to port 3011");

})