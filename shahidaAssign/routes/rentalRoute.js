const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const rental = require('../middleware/rental');
const { movieId, customerId, rentId } = require('../middleware/existence');

router.get('/current/', auth, (req, res) => {
    rental.getCurrentlyRented(req, res);
});

router.get('/:pagination?', auth, (req, res) => {
    rental.getRented(req.params.pagination, res);
});

router.get('/rent/:rentId', [auth, rentId], (req, res) => {
    rental.getRentedById(req, res);
});

router.get('/movie/:movieId', [auth, movieId], (req, res) => {
    rental.getRentedByMovieId(req, res);
});

router.get('/customer/:customerId', [auth, customerId], (req, res) => {
    rental.getRentedByCustomerId(req, res);
});

router.post('/', [auth, movieId, customerId], (req, res) => {
    rental.addRented(req, res);
});

router.put('/rent/:rentId', [auth, rentId], (req, res) => {
    rental.modifyRented(req, res);
});

router.delete('/movie/:movieId', [auth, admin], (req, res) => {
    rental.deleteByMovieId(req, res);
});
router.delete('/customer/:customerId', [auth, admin], (req, res) => {
    rental.deleteByCustomerId(req, res);
});
module.exports = router;
