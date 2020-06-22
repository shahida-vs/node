const { Movie } = require('../Models/movie');
const { Customer } = require('../Models/customer');
const { Rental } = require('../Models/rental');
const mongoose = require('mongoose');
const _ = require('lodash')

movieId = async (req, res, next) => {
    const movie = await Movie.findOne({ movieId: _.get(req, ["params", "movieId"], _.get(req, ["body", "movieId"])) })

    if (!movie) {
        return res.status(400).send("movie id does not exist");
    }
    req.movie = movie
    next();
}

customerId = async (req, res, next) => {
    const customer = await Customer.findOne({ customerId: _.get(req, ["params", "customerId"], _.get(req, ["body", "customerId"])) })
    if (!customer) {
        return res.status(400).send("customer id does not exist");
    }
    req.customer = customer
    next();
}

rentId = async (req, res, next) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.rentId)) {
        return res.status(400).send('Invalid ID')
    }
    const rental = await Rental.findOne({ _id: req.params.rentId })
    if (!rental) {
        return res.status(400).send("id does not exist");
    }
    req.rental = rental

    next();
}

module.exports = { movieId, customerId, rentId };