const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/demo',
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to mongodb'))
    .catch((err) => console.log('Unable to connect'));

const courseSchema = new mongoose.Schema({
    name: String,
    author: String,
    tags: [String],
    isPublished: { type: Boolean, default: false },
    date: { type: Date, default: Date.now },
    price: Number
})
const Course = mongoose.model('Course', courseSchema);

const createCourse = async () => {
    const course = new Course({
        name: "Native",
        author: "Manish",
        tags: ["yarn", "node"],
        isPublished: true,
        price: 700,
    })
    const result = await course.save();
}
//createCourse();

const getCourses = async () => {
    // const course = await Course.find({ price: { $gt: 400 } })

    // const course = await Course.find({ price: { $in: [400, 700] } })
    //     .limit(2)
    //     .select({ name: 1, tags: 1, author: 1, isPublished: 1 });
    var limit = parseInt(2);
    var skip = (parseInt(3) - 1) * parseInt(limit);
    const course = await Course.find()
        // .or([{ isPublished: true }, { isPublished: false }])
        // .and([{ author: { $in: ['Shahida', 'Zaara'] } }, { isPublished: true }])
        .skip(skip)
        .limit(limit)
        .select({ name: 1, tags: 1, author: 1, isPublished: 1 });
    console.log("courses ", course);

}
getCourses();