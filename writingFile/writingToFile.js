const fs = require('fs');
const file = `${process.argv[2]}`;

const content = process.argv[3] ? `${process.argv[3]}` : '';
if (fs.existsSync(file)) {
    const fileData = fs.readFileSync(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
    })
    console.log("Initial File Content : ", fileData);

}
else {
    console.log("File Doesn't Exist");

}
fs.appendFile(file, content, (err) => {
    if (err) {
        console.error(err)
        return
    } else {
        console.log("Successfully Written");
    }
})