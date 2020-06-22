const _ = require('lodash');
const joi = require('joi');
const { Movie } = require('../Models/movie');
const { Rental } = require('../Models/rental');

const getRented = async (pagination, res) => {
    var limit = parseInt(2);
    if (!pagination) {
        pagination = 1;
    }
    var skip = (parseInt(pagination) - 1) * parseInt(limit);
    if (Number.isNaN(skip)) {
        return res.status(400).send("Invalid Page Number")
    }
    const rental = await Rental.find()
        .skip(skip)
        .limit(limit);
    console.log("rental ", rental);
    res.send(rental);
}
const getRentedById = async (req, res) => {
    try {
        console.log("rental with id ", req.rental);
        return res.send(req.rental);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
const getRentedByMovieId = async (req, res) => {
    try {
        const rental = await Rental.find({ movieId: req.params.movieId })
        console.log("rental with movie id ", rental);
        return res.send(rental);
    }
    catch (err) {
        console.log("error is ", err);
        return res.status(404);
    }
}
const getRentedByCustomerId = async (req, res) => {
    try {
        const rental = await Rental.find({ customerId: req.params.customerId })
        console.log("rental with movie id ", rental);
        return res.send(rental);
    }
    catch (err) {
        console.log("error is ", err);
        return res.status(404);
    }
}
const getCurrentlyRented = async (req, res) => {
    try {

        const rental = await Rental.find({ dateReturned: { $exists: false } }).sort({ dateOut: 'desc' })
        console.log("currently rented out movies ", rental);
        return res.send(rental);
    }
    catch (err) {
        console.log("error is ", err);
        return res.status(404);
    }
}
const addRented = async (req, res) => {
    const schema = joi.object().keys({
        customerId: joi.string().required(),
        movieId: joi.string().required()
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

        if (req.movie.currentlyAvailable > 0) {
            req.movie.currentlyAvailable = req.movie.currentlyAvailable - 1;
            const movie = await Movie.findOneAndUpdate({ movieId: req.movie.movieId },
                { $set: req.movie },
                { new: true })
            console.log("updated movie ", movie);
            const rental = new Rental(_.pick(req.body, ["customerId", "movieId"]));
            rental.dateOut = new Date();
            const result = await rental.save();
            res.send(result);
            return;
        } else {
            return res.send('Sorry! All copies of movie are rented out')
        }

    }
    catch (err) {
        console.log(err);
    }
}

const modifyRented = async (req, res) => {
    const schema = joi.object().keys({
        damageCharges: joi.number()
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
        if (req.rental.dateReturned) {
            return res.send('Movie has already been returned')
        }
        let movie = await Movie.findOne({ movieId: _.get(req, ["rental", "movieId"]) })

        movie.currentlyAvailable = movie.currentlyAvailable + 1;
        movie = await Movie.findOneAndUpdate({ movieId: req.rental.movieId },
            { $set: movie },
            { new: true })
        console.log("updated movie ", movie);


        const returnedDate = new Date();
        req.rental.dateReturned = returnedDate;
        const diff = Math.ceil((returnedDate - req.rental.dateOut) / (1000 * 60 * 60 * 24));
        req.rental.rentalFee = diff * movie.dailyRentalRate;
        req.rental.totalCharges = (req.body.damageCharges) ? req.rental.rentalFee + req.body.damageCharges : req.rental.rentalFee;
        req.rental.damageCharges = req.body.damageCharges;
        const rental = await Rental.findOneAndUpdate({ _id: req.params.rentId },
            { $set: req.rental },
            { new: true })
        console.log("updated rental ", rental);
        return res.send(rental)
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
const deleteByCustomerId = async (req, res) => {
    try {
        const customers = await Rental.remove({ customerId: req.params.customerId })
        console.log("customers with id to delete", customers);
        res.send(customers)
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('Error Occurred!');
    }
}
const deleteByMovieId = async (req, res) => {
    try {
        const movies = await Rental.remove({ movieId: req.params.movieId })
        console.log("customer with id to delete", movies);
        res.send(movies)
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('Error Occurred!!');
    }
}
module.exports = { getRented, getRentedById, getRentedByMovieId, getRentedByCustomerId, getCurrentlyRented, addRented, modifyRented, deleteByMovieId, deleteByCustomerId }