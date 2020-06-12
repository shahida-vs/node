const express = require('express');
const router = express.Router();
const db = require('../middleware/itemsDatabase');



// db.connectMongodb();

router.get('/', (req, res) => {
    db.getItems(res);
});

router.get('/:itemId', (req, res) => {
    db.getItem(req.params.itemId, res);
});

router.post('/', (req, res) => {
    db.addItem(req, res);
});

// router.put('/:itemId', (req, res) => {
//     db.modifyItem(req, res);
// });

router.delete('/:itemId', (req, res) => {
    db.deleteItem(req, res);
});

module.exports = router;
