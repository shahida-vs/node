const mongoose = require('mongoose');
const joi = require('joi');
const { Log } = require('../models/logModel')

const getLogs = async (res) => {
    const logs = await Log.find();
    console.log("logs ", logs);
    res.send(logs);
}

const getLog = async (logId, res) => {
    try {
        const log = await Log.findOne({ _id: logId })
        console.log("log with id ", log);
        if (!log) {
            res.send("The log with given log id does not exist")
            return;
        }
        res.send(log);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The log with given log id does not exist');
    }
}
const getLogsByItem = async (itemId, res) => {
    try {
        const logs = await Log.find({ itemId: itemId })
        console.log("log with id ", logs);
        if (!logs.length) {
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
const getLogsByCategory = async (categoryId, res) => {
    try {
        const logs = await Log.find({ categoryId: categoryId })
        console.log("log with id ", logs);
        if (!logs.length) {
            res.send("The log with given category id does not exist")
            return;
        }
        res.send(logs);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The log with given category id does not exist');
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
        res.send('The log with given log id does not exist');
    }
}
module.exports = { getLogs, getLog, deleteLog, getLogsByItem, getLogsByCategory }