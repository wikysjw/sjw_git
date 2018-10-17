var fs = require('fs');
var ko = fs.readFile('data/korean', 'utf-8', function(error, data) {
    console.log(data);
    return data;
});
console.dir(ko);