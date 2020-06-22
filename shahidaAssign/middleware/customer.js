const _ = require('lodash');
const joi = require('joi');
const { Customer } = require('../Models/customer');
const { Rental } = require('../Models/rental');

const getCustomers = async (pagination, res) => {
    var limit = parseInt(2);
    if (!pagination) {
        pagination = 1;
    }
    var skip = (parseInt(pagination) - 1) * parseInt(limit);
    if (Number.isNaN(skip)) {
        return res.status(400).send("Invalid Page Number")
    }
    const customers = await Customer.find()
        .skip(skip)
        .limit(limit);
    console.log("customers ", customers);
    res.send(customers);
}
const getCustomer = async (req, res) => {
    try {
        console.log("customers with id ", req.customer);
        res.send(req.customer);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
const createCustomer = async (req, res) => {
    const schema = joi.object().keys({
        name: joi.string().required().min(5).max(50),
        phone: joi.number().integer().min(1000000000).max(9999999999).required(),
        customerId: joi.string().required()
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
    try {
        let customers = await Customer.find({ customerId: req.body.customerId })
        if (customers.length) {
            return res.status(400).send("customerId already exists")
        }
        customers = await Customer.find({ phone: req.body.phone })

        if (customers.length) {
            return res.status(400).send("phone no already exists")
        }

        const customer = new Customer(_.pick(req.body, ["name", "phone", "customerId"]))
        const result = await customer.save();
        res.send(result);
        return;
    }
    catch (err) {
        res.status(404)
        console.log(err);
    }
}

const modifyCustomer = async (req, res) => {
    const schema = joi.object().keys({
        name: joi.string().min(5).max(50),
        phone: joi.number().integer().min(1000000000).max(9999999999),
    })
    const validate = joi.validate(req.body, schema);
    const { value, error } = validate;
    const valid = error == null;
    if (!valid) {
        res.status(400).json({
            message: 'Invalid request!',
            data: req.body
        })
        return;
    }
    try {
        customers = await Customer.find({ phone: req.body.phone })

        if (customers.length) {
            return res.status(400).send("phone no already exists")
        }

        const customer = await Customer.findOneAndUpdate({ customerId: req.params.customerId },
            { $set: req.body },
            { new: true })
        console.log("updated customer ", customer);
        res.send(customer)
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}

const deleteCustomer = async (req, res) => {
    try {
        const rental = await Rental.find({ customerId: req.params.customerId });
        if (rental.length) {
            return res.status(403).send("Not Allowed! First delete the logs of customer from rental");
        }
        const customer = await Customer.remove({ customerId: req.params.customerId });
        console.log("customer with id to delete", customer);
        return res.send(customer);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
module.exports = { getCustomer, getCustomers, createCustomer, modifyCustomer, deleteCustomer };