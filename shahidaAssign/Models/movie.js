const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, minlength: 5, maxlength: 50 },
    noInStock: { type: Number, required: true },
    dailyRentalRate: { type: Number, required: true },
    currentlyAvailable: { type: Number, required: true },
    movieId: { type: String, required: true, unique: true }
})

const Movie = mongoose.model('Movie', movieSchema);

module.exports = { Movie };
