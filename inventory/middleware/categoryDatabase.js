const mongoose = require('mongoose');
const joi = require('joi');
const { Category } = require('../models/categoryModel')
const _ = require('lodash');

function connectMongodb() {
    mongoose.connect('mongodb://localhost/categoryDB',
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to mongodb'))
        .catch((err) => console.log('Unable to connect'));

}

const getCategories = async (res) => {
    const categories = await Category.find();
    console.log("categories ", categories);
    res.send(categories);
}

const getCategory = async (categoryId, res) => {
    try {
        const category = await Category.find({ categoryId: categoryId })
        console.log("category with id ", category);
        if (!category.length) {
            res.send('The category with given id does not exist');
        }
        res.send(category);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The category with given id does not exist');
    }
}
const addCategory = async (req, res) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        categoryId: joi.string().required()
    })
    const validate = joi.validate(req.body, schema);
    const { value, error } = validate;
    const valid = error == null;

    let category = await Category.findOne({ categoryId: req.body.categoryId })

    if (!valid) {
        res.status(400).json({
            message: 'Invalid request! Either some fields are missing or extra or invalid values',
            data: req.body
        })
        return;
    }
    if (category) {
        res.status(400).json({
            message: 'Category id already exists!',
            data: req.body
        })
        return;
    }
    category = new Category(_.pick(req.body, ["name", "categoryId", "items", "itemCount"]))
    const result = await category.save();
    res.send(result);
}

const updateCategory = async (req, res) => {
    const schema = joi.object().keys({
        name: joi.string()
    })
    const validate = joi.validate(req.body, schema);
    try {
        if (!validate.error) {
            let category = await Category.findOne({ categoryId: req.params.categoryId });
            if (category) {
                category = await Category.findOneAndUpdate({ categoryId: req.params.categoryId },
                    { $set: req.body },
                    { new: true })
                console.log("updated category ", category);
                res.send(category)
            }
            else {
                res.status(404);
                res.send("ID doesn't exists")
            }
        } else {
            res.status(404);
            res.send("only name of the category can be updated")
        }
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
module.exports = { connectMongodb, getCategories, getCategory, addCategory, updateCategory }