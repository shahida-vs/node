const fs = require('fs');
const express = require('express');
const app = express();

const file = `${process.argv[2]}`;
const str = process.argv[3] ? `${process.argv[3]}` : '';

function stringPermutations(str) {
    let letters = str.split('')
        , results = [[letters.shift()]]
    while (letters.length) {
        const currLetter = letters.shift()
        let tmpResults = []
        results.forEach(result => {
            let rIdx = 0
            while (rIdx <= result.length) {
                const tmp = [...result]
                tmp.splice(rIdx, 0, currLetter)
                tmpResults.push(tmp)
                rIdx++
            }
        })
        results = tmpResults
    }
    return results
        .map(letterArray => letterArray.join(''))
        .filter((el, idx, self) => (self.indexOf(el) === idx))
        .sort()
}
const content = stringPermutations(str);


fs.appendFile(file, content, (err) => {
    if (err) {
        console.error(err)
        return
    } else {
        console.log("Successfully Written");
        app.get('/', function (req, res) {
            res.send({ "message": "Successfully written", "content": `"${content}"` })
        })
    }
})

app.listen(3006, function () {
    console.log("Listening on port 3006");

})