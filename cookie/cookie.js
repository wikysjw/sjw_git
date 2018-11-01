var http = require('http');
var cookie = require('cookie');
var express = require('express');
var app = express();
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.get('/lo', function(req,res) {
    response.cookie('id',1,{maxAge:100000});
    res.redirect('/');
});
app.get('/state', function(req,res) {
    res.send('cookie : ' + req.cookies.key);
});


http.createServer(function(requset, response) {
    console.log(requset.headers.cookie);
    var cookies = {};
    if(requset.headers.cookie !== undefined){
        var cookies = cookie.parse(requset.headers.cookie);
    }
    console.log(cookies.yummy_cookie);
    response.writeHead(200, {
        'Set-Cookie':['yummy_cookie=choco', 
        'tasty_cookie=strawberry',
        `Permanent=cookies; Max-Age=${60*60*24*30}`,
        'Secure=Secure; Secure',
        'HttpOnly=HttpOnly; HttpOnly',
        'Path=Path; Path=/cookie',
        'Domain=Domain; Domain=o2.org'
    ]
    });

    response.end('쿠키');
}).listen(5034);

var x = document.cookie;
console.log(x);