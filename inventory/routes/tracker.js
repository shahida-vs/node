const express = require('express');
const router = express.Router();
const db = require('../middleware/trackerDatabase');




router.get('/', (req, res) => {
    db.getLogs(res);
});

router.get('/:logId', (req, res) => {
    db.getLog(req.params.logId, res);
});
router.get('/item/:itemId', (req, res) => {
    db.getLogsByItem(req.params.itemId, res);
})
router.get('/category/:categoryId', (req, res) => {
    db.getLogsByCategory(req.params.categoryId, res);
})
router.delete('/:logId', (req, res) => {
    db.deleteLog(req, res);
});

module.exports = router;
