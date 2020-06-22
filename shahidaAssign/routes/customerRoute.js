const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin');
const customer = require('../middleware/customer');
const { customerId } = require('../middleware/existence');


router.get('/:pagination?', auth, (req, res) => {
    customer.getCustomers(req.params.pagination, res);
});

router.get('/customer/:customerId', [auth, customerId], (req, res) => {
    customer.getCustomer(req, res);
});

router.post('/', auth, (req, res) => {
    customer.createCustomer(req, res);
});

router.put('/customer/:customerId', [auth, customerId], (req, res) => {
    customer.modifyCustomer(req, res);
});

router.delete('/customer/:customerId', [auth, admin, customerId], (req, res) => {
    customer.deleteCustomer(req, res);
});

module.exports = router;
