var http = require('http');

var path = require('path');

var static = require('serve-static');

var socketio = require('socket.io');

var fs = require('fs');

var csv = require('fast-csv');

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
    })

    fs.readFile(`data/english`, 'utf-8', function(err,data){
        socket.emit('language',data);
    });

    fs.readFile(`data/japanese`, 'utf-8', function(err,data){
        socket.emit('language2',data);
    });

    fs.readFile(`data/korean`, 'utf-8', function(err,data){
        socket.emit('language3',data);
    });

    fs.readdir('csv', 'utf-8', function(err, filelist) {
        socket.emit('filelist2',filelist);
    })

    fs.readFile(`data/english.csv`, 'utf-8', function(err,data){
        
        var stream = fs.createReadStream("./csv/english.csv", {encoding: "utf8"});

        var csvStream = csv()
            .on("data", function(data){
                socket.emit("language4",data);
            })
        stream.pipe(csvStream);
    });

    
        
        var stream = fs.createReadStream("./csv/english.csv", {encoding: "utf8"});

        var csvStream = csv()
            .on("data", function(data){
                socket.emit("language4",data);
            })
        stream.pipe(csvStream);
   

        var stream = fs.createReadStream("./csv/japanese.csv", {encoding: "utf8"});

        var csvStream = csv()
            .on("data", function(data){
                socket.emit("language5",data);
            })
        stream.pipe(csvStream);

        var stream = fs.createReadStream("./csv/korean.csv", {encoding: "utf8"});

        var csvStream = csv()
            .on("data", function(data){
                socket.emit("language6",data);
            })
        stream.pipe(csvStream);

    socket.on('message', function(message) {
        console.log('메세지를 받았습니다.');
        console.dir(message);

        if(message.recepient == 'ALL') {
            console.dir('나를 포함한 모든 클라이언트에게 메세지를 전달.');
            io.sockets.emit('message',message);
        }
    });
});