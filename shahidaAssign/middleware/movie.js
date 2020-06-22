const _ = require('lodash');
const joi = require('joi');
const { Movie } = require('../Models/movie');
const { Rental } = require('../Models/rental');

const getMovies = async (pagination, res) => {
    var limit = parseInt(2);
    if (!pagination) {
        pagination = 1;
    }
    var skip = (parseInt(pagination) - 1) * parseInt(limit);
    if (Number.isNaN(skip)) {
        return res.status(400).send("Invalid Page Number")
    }
    const movies = await Movie.find()
        .skip(skip)
        .limit(limit);;
    console.log("movies ", movies);
    res.send(movies);
}
const getMovie = async (req, res) => {
    try {
        console.log("movie with id ", req.movie);
        res.send(req.movie);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
const createMovie = async (req, res) => {
    const schema = joi.object().keys({
        title: joi.string().required().min(5).max(50),
        noInStock: joi.number().required(),
        movieId: joi.string().required(),
        dailyRentalRate: joi.number().required()
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

        const movies = await Movie.find({ movieId: req.body.movieId })
        if (movies.length) {
            return res.status(400).send("movieId already exists")
        }
        const movie = new Movie(_.pick(req.body, ["title", "noInStock", "movieId", "dailyRentalRate"]));
        movie.currentlyAvailable = req.body.noInStock;
        const result = await movie.save();
        res.send(result);
        return;
    }
    catch (err) {
        res.status(404);
        console.log(err);
    }
}

const modifyMovie = async (req, res) => {
    const schema = joi.object().keys({
        title: joi.string().min(5).max(50),
        noInStock: joi.number(),
        dailyRentalRate: joi.number()
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
        const movie = await Movie.findOneAndUpdate({ movieId: req.params.movieId },
            { $set: req.body },
            { new: true })
        console.log("updated movie ", movie);
        res.send(movie);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}

const deleteMovie = async (req, res) => {
    try {
        const rental = await Rental.find({ movieId: req.params.movieId });
        if (rental.length) {
            return res.status(403).send("Not Allowed! First delete the logs of movie from rental");
        }
        const movie = await Movie.remove({ movieId: req.params.movieId });
        console.log("movie with given id to delete", movie);
        return res.send(movie);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
    }
}
module.exports = { getMovies, getMovie, createMovie, modifyMovie, deleteMovie };