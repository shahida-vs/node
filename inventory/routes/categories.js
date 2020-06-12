const express = require('express');
const router = express.Router();
const db = require('../middleware/categoryDatabase');



db.connectMongodb();

router.get('/', (req, res) => {
    db.getCategories(res);
});

router.get('/:categoryId', (req, res) => {
    db.getCategory(req.params.categoryId, res);
});

router.post('/', (req, res) => {
    db.addCategory(req, res);
});

router.put('/:categoryId', (req, res) => {
    db.updateCategory(req, res);
});

module.exports = router;
