const express = require('express');
const app = express();
const joi = require('joi');

app.use(express.json());

const trainees = [
    { id: 1, name: 'Shahida' },
    { id: 2, name: 'Charu' },
    { id: 3, name: 'Zafar' }
];
app.get('/api/trainees', (req, res) => {
    res.send(trainees);
});

app.get('/api/trainees/:traineeId?', (req, res) => {
    const trainee = trainees.find(c => c.id === parseInt(req.params.traineeId));
    if (!trainee) {
        res.status(404);
        res.send('The trainee with given id does not exist');
        return;
    }
    res.send(trainee);
});

app.post('/api/trainees', (req, res) => {
    const schema = joi.object().keys({
        name: joi.string().required()
    })
    const result = joi.validate(req.body, schema);
    const { value, error } = result;
    const valid = error == null;
    if (!valid) {
        res.status(400).json({
            message: 'Invalid request! Name Required',
            data: req.body
        })
        return;
    }
    const trainee = {
        id: trainees.length + 1,
        name: req.body.name
    };
    trainees.push(trainee);
    res.send(trainee);
});

app.put('/api/trainees/:traineeId', (req, res) => {
    const trainee = trainees.find(c => c.id === parseInt(req.params.traineeId));
    if (!trainee) {
        res.status(404);
        res.send('The trainee with given id does not exist');
        return;
    }
    const index = trainees.indexOf(trainee);
    trainees.splice(index, 1);
    trainee.name = req.body.name;
    trainees.push(trainee);
    res.send(trainee);
});

app.delete('/api/trainees/:traineeId', (req, res) => {
    const trainee = trainees.find(c => c.id === parseInt(req.params.traineeId));
    if (!trainee) {
        res.status(404);
        res.send('The trainee with given id does not exist');
        return;
    }

    const index = trainees.indexOf(trainee);
    trainees.splice(index, 1);
    res.send(trainee);
});


app.listen(3010, () => {
    console.log("Listening to port 3010");

})