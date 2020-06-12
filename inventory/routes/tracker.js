const express = require('express');
const router = express.Router();
const db = require('../middleware/trackerDatabase');



// db.connectMongodb();

router.get('/', (req, res) => {
    db.getLogs(res);
});

router.get('/:logId', (req, res) => {
    db.getLog(req.params.logId, res);
});
router.get('/item/:itemId', (req, res) => {
    db.getLogByItem(req.params.itemId, res);
})
router.delete('/:logId', (req, res) => {
    db.deleteLog(req, res);
});

module.exports = router;
