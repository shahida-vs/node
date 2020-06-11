const mongoose = require('mongoose');
const joi = require('joi');

function connectMongodb() {
    mongoose.connect('mongodb://localhost/demo',
        { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to mongodb'))
        .catch((err) => console.log('Unable to connect'));

}
const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    isPublished: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    price: Number
})
const Course = mongoose.model('Course', courseSchema);

const getCourses = async (res) => {
    const courses = await Course.find();
    console.log("courses ", courses);
    res.send(courses);
}
const getCourse = async (courseId, res) => {
    try {
        const course = await Course.find({ _id: courseId })
        console.log("courses with id ", course);
        res.send(course);
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The course with given id does not exist');
    }
}
const createCourse = async (req, res) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        author: joi.string().required(),
        tags: joi.array().items(joi.string()).min(1).required(),
        isPublished: joi.boolean().required(),
        price: joi.number(),
        date: joi.date()
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
    const course = new Course({
        name: req.body.name,
        author: req.body.author,
        tags: req.body.tags,
        isPublished: req.body.isPublished,
        price: req.body.price,
    })
    const result = await course.save();
    res.send(result);
}

const modifyCourse = async (req, res) => {
    try {
        const course = await Course.findOneAndUpdate({ _id: req.params.courseId },
            { $set: req.body },
            { new: true })
        console.log("updated course ", course);
        res.send(course)
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The course with given id does not exist');
    }
}

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete({ _id: req.params.courseId })
        console.log("courses with id to delete", course);
        res.send(course)
    }
    catch (err) {
        console.log("error is ", err);
        res.status(404);
        res.send('The course with given id does not exist');
    }
}
module.exports = { connectMongodb, getCourse, getCourses, createCourse, modifyCourse, deleteCourse };