var http = require('http');

var path = require('path');

var static = require('serve-static');

var socketio = require('socket.io');

var fs = require('fs');

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

fs.readdir('data', 'utf-8', function(err, filelist) {
    socket.emit('filelist',filelist);

    for(let i = 0; i < filelist.length; i++){
        console.log(filelist[i]);
        (function emitdata(callbackFunc){
            fs.readFile(`data/${filelist[callbackFunc]}`, 'utf-8', function(err, data){
                socket.emit(`language${callbackFunc}`,data);
            });
        })(i);
    }
});

    socket.on('message', function(message) {
        console.log('메세지를 받았습니다.');
        console.dir(message);
        

        if(message.recepient == 'ALL') {
            console.dir('나를 포함한 모든 클라이언트에게 메세지를 전달.');
            io.sockets.emit('message',message);
        }
    });
});