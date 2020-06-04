const fs = require('fs');
const file = `${process.argv[2]}`;

const content = process.argv[3] ? `${process.argv[3]}` : '';
fs.appendFile(file, content, (err) => {
    if (err) {
        console.error(err)
        return
    } else {
        console.log("Sucessfully Written");
    }
})