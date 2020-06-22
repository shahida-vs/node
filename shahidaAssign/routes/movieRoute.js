const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const movie = require('../middleware/movie');
const { movieId } = require('../middleware/existence');

router.get('/:pagination?', auth, (req, res) => {
    movie.getMovies(req.params.pagination, res);
});

router.get('/movie/:movieId', [auth, movieId], (req, res) => {
    movie.getMovie(req, res);
});

router.post('/', auth, (req, res) => {
    movie.createMovie(req, res);
});

router.put('/movie/:movieId', [auth, movieId], (req, res) => {
    movie.modifyMovie(req, res);
});

router.delete('/movie/:movieId', [auth, admin, movieId], (req, res) => {
    movie.deleteMovie(req, res);
});

module.exports = router;
