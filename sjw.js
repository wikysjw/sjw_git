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

    fs.readdir('./public/data', 'utf-8', function(err, filelist) {
        socket.emit('filelist',filelist);
        for(var i = 0; i < filelist.length; i++){
            (function (closed_i){
            fs.readFile(`./public/data/${filelist[(closed_i-1)]}`, 'utf-8', function(err,data){
                socket.emit(`language${closed_i}`,data);
            });
        })(i+1);
        }
    })

    fs.readdir('./public/csv', 'utf-8', function(err, filelist) {
        socket.emit('filelist2',filelist);
    })

    socket.on('text_content', function(content){
        socket.on('text_title',function(title) {
            fs.writeFile(`./public/data/${title}`, content, 'utf8',function(err) {
                if(err) throw err;
                console.log('file write success')
            });
        });
    });

    socket.on('file_load', function(loadfile) {
        fs.readFile(`./public/data/${loadfile}`, 'utf-8', function(err, data){
            socket.emit(`loadfile`, data);
        });
    });

    /* fs.readdir('csv', 'utf-8', function(err, filelist) {
        var sendMsg = {
            CODE: 10000,
            FileName: "english.csv",
            Data: filelist
        }
        socket.emit('message',sendMsg);
    }) */
     
    socket.on('message', function(message) {
        console.log('메세지를 받았습니다.');
        console.dir(message);

        if(message.recepient == 'ALL') {
            console.dir('나를 포함한 모든 클라이언트에게 메세지를 전달.');
            io.sockets.emit('message',message);
        }else if(message.recepient == 'exit'){
            io.close();
        }
    });
});