const express = require('express');
const router = express.Router();
const db = require('../middleware/database');



db.connectMongodb();

router.get('/', (req, res) => {
    db.getCourses(res);
});

router.get('/:courseId', (req, res) => {
    db.getCourse(req.params.courseId, res);
});

router.post('/', (req, res) => {
    db.createCourse(req, res);
});

router.put('/:courseId', (req, res) => {
    db.modifyCourse(req, res);
});

router.delete('/:courseId', (req, res) => {
    db.deleteCourse(req, res);
});

module.exports = router;
