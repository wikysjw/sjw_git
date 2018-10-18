var fs = require('fs');
var csv = require('fast-csv');
var stream = fs.createReadStream("./csv/english.csv", {encoding: "utf8"});

var csvStream = csv()
    .on("data", function(data){
         console.log(data);
    })
    .on("end", function(){
         console.log("done");
    });
 
stream.pipe(csvStream);