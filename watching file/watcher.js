const fs = require('fs');

fs.watchFile(`${process.argv[2]}`, (cur, prev) => {
    console.log('File created at"' + cur.birthtime + '" last modified at : ' + cur.mtime);
})
console.log(`Nothing changed in file ${process.argv[2]}`);
