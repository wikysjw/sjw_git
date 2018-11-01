var http = require('http');
var cookie = require('cookie');
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