const express = require('express');
const app = express();
const courses = require('./routes/courses')


app.use(express.json());
app.use('/api/courses', courses)
app.listen(3089, function () {
    console.log("Listening to port 3089");

})