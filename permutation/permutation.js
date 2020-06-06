const fs = require('fs');
const file = `${process.argv[2]}`;

if (fs.existsSync(file)) {
    const fileData = fs.readFileSync(file, 'utf8', function (err, data) {
        if (err) {
            console.log(err);
            return;
        }
    })
    console.log("Initial File Content : ", fileData, fileData.length);
    const strArray = fileData.split();
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
    const res = stringPermutations(fileData);
    console.log(res);


}
else {
    console.log("File Doesn't Exist");

}