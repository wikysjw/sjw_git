var http = require('http');

var path = require('path');

var static = require('serve-static');

var socketio = require('socket.io');

var express = require('express');

var app = express();

var cors = require('cors');

app.use(cors());

app.set('port', process.env.PORT || 5034);

app.use('/public', static(path.join(__dirname, 'public')));

var server = http.createServer(app).listen(app.get('port'), function() {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));
});

var io = socketio.listen(server);
console.log('응답 대기중...');

io.sockets.on('connection', function(socket) {
    console.log('connection info : ', socket.request.connection._peername);

    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port;
});