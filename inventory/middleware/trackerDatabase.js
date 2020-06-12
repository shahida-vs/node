const mongoose = require('mongoose');
const joi = require('joi');
const { Log } = require('../models/logModel')

function connectMongodb() {
    mongoose.connect('mongodb://localhost/logsDB',
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to mongodb'))
        .catch((err) => console.log('Unable to connect'));

}

const getLogs = async (res) => {
    const logs = await Log.find();
    console.log("logs ", logs);
    res.send(logs);
}

const getLog = async (logId, res) => {
    try {
        const log = await Log.findOne({ _id: logId })
        console.log("log with id ", log);
        res.send(log);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The log with given log id does not exist');
    }
}
const getLogByItem = async (itemId, res) => {
    try {
        const logs = await Log.find({ itemId: itemId })
        console.log("log with id ", logs);
        if (!log) {
            res.send("The log with given item id does not exist")
            return;
        }
        res.send(logs);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The log with given item id does not exist');
    }
}
const deleteLog = async (req, res) => {
    try {
        const removedLog = await Log.findByIdAndDelete({ _id: req.params.logId })
        res.send(removedLog);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The log with given id does not exist');
    }
}
module.exports = { connectMongodb, getLogs, getLog, deleteLog, getLogByItem }