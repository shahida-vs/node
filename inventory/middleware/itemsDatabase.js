const mongoose = require('mongoose');
const joi = require('joi');
const _ = require('lodash')
const { Item } = require('../models/itemModel')
const { Category } = require('../models/categoryModel');
const { Log } = require('../models/logModel');



const getItems = async (res) => {
    const items = await Item.find();
    console.log("items ", items);
    res.send(items);
}
const getItem = async (itemId, res) => {
    try {
        const item = await Item.find({ _id: itemId })
        console.log("item with id ", item);
        if (!item.length) {
            res.send("The item with given item id does not exist")
            return;
        }
        res.send(item);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The item with given id does not exist');
    }
}
const addItem = async (req, res) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        author: joi.string().required(),
        price: joi.number().required(),
        date: joi.date(),
        categoryId: joi.string().required()
    })
    const validate = joi.validate(req.body, schema);
    const { value, error } = validate;
    const valid = error == null;
    if (!valid) {
        res.status(400).json({
            message: 'Invalid request! Either some fields are missing or invalid values',
            data: req.body
        })
        return;
    }
    const item = new Item(_.pick(req.body, ["name", "author", "price", "categoryId"]))
    try {
        const category = await Category.findOne({ categoryId: req.body.categoryId })
        if (category) {
            let arr = category.items;
            let element = arr.find((el) => el.itemName === req.body.name);
            if (element) {
                await arr.splice(arr.indexOf(element), 1);
                element.itemCount = element.itemCount + 1;
                await arr.push(element)
            } else {
                element = {
                    itemName: req.body.name,
                    itemCount: 1
                }
                await arr.push(element)
            }
            let obj = { itemCount: category.itemCount + 1, items: arr }
            const updatedCategory = await Category.findOneAndUpdate({ categoryId: req.body.categoryId }, { $set: obj }, {
                new: true
            })
            const addedItem = await item.save();
            obj = _.pick(addedItem, ["author", "price", "categoryId"]);
            obj.operation = "Added";
            obj.itemId = addedItem._id;
            obj.item = addedItem.name
            const log = new Log({
                ...obj
            })

            const addedLog = await log.save();
            res.send({ addedLog, addedItem, updatedCategory });
        } else {
            res.send("Category doesn't exist! add the category first")
        }
    }
    catch (err) {
        console.log(err);
    }
}


const deleteItem = async (req, res) => {
    try {
        const item = await Item.findOne({ _id: req.params.itemId })
        if (item) {
            const category = await Category.findOne({ categoryId: item.categoryId })

            let arr = category.items;
            let element = arr.find((el) => el.itemName === item.name);
            if (element) {
                await arr.splice(arr.indexOf(element), 1);
                element.itemCount = element.itemCount - 1;
                if (element.itemCount) {
                    await arr.push(element)
                }
            } else {
                console.log("some error!Item which doesn't exist is being deleted");
            }

            let obj = { itemCount: category.itemCount - 1, items: arr }
            const updatedCategory = await Category.findOneAndUpdate({ categoryId: item.categoryId }, { $set: obj }, {
                new: true
            })
            const removedItem = await Item.findByIdAndDelete({ _id: req.params.itemId })
            obj = _.pick(removedItem, ["author", "price", "categoryId"]);
            obj.operation = "Removed";
            obj.item = removedItem.name
            obj.itemId = removedItem._id;
            const log = new Log({
                ...obj
            })

            const addedLog = await log.save();

            res.send({ removedItem, updatedCategory, addedLog });
        }
        else {
            res.send("The item with given item id does not exist");
        }
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The item with given item id does not exist');
    }
}
module.exports = { getItem, getItems, addItem, deleteItem };