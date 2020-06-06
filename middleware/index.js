const express = require('express');
const app = express();

app.use(function (req, res) {
    res.type('text/plain');
    req.tm = new Date().toDateString();
    res.send({ "message": "displaying time", "time": req.tm });
})
app.get('/', function (req, res) {
    res.type('text/plain');
    res.send({ "message": "Learning Node Middleware" });
})

app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send("404 - Page Not Found")
})


app.listen(3005, function () {
    console.log("Listening on port 3005");

})