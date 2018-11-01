var http = require('http');

var path = require('path');

var static = require('serve-static');

var socketio = require('socket.io');

var fs = require('fs');

var express = require('express');

var app = express();

var cors = require('cors');

const mysql = require('mysql');

const connection = mysql.createConnection({
    host     : 'sjw9606.cafe24.com',
    user     : 'sjw9606',
    password : 'ms6600!!',
    port     : '3306',
    database : 'sjw9606',
})

var cookie = require('cookie');

const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
// var expressSession = require('express-session');

app.use(cors());

// 세션 값 넣기
// app.use(expressSession({
//     secret:'my key',
//     resave:true,
//     saveUninitialized:true
// }));

app.set('port', process.env.PORT || 5034);

app.use('/public', static(path.join(__dirname, 'public')));

app.use('/login',  static(path.join(__dirname, 'login')));

app.get('/login', function(req,res) {
    res.writeHead(302, {
        'Set-Cookie':[
          `email=${post.email}`,
          `password=${post.password}`,
          `nickname=egoing`
        ]
    });
});


var server = http.createServer(app).listen(app.get('port'), function(req,res) {
    console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

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
    socket.on('login_info', function(info) {
        console.log(info);
        // for(var obj in info){
        //     console.log(obj +''+info[obj]);
        //     ID = info[obj];
        // }
        var ID2 = info['id'];
        var PW2 = info['pw'];
        connection.query(`select ID from login where ID="${ID2}"`, (error, results) => {
            var osd2 = results;
            console.log(osd2);
            if(osd2==""){
                var bbi2 ='없는 아이디입니다. 다시 확인 해주세요.';
                socket.emit('bbi2',bbi2);
            }else{
                connection.query(`select PW from login where ID="${ID2}"`, (error, results) => {
                var osd = results[0].PW.toString('utf8');
                console.log(osd);
                    if(osd == PW2){
                        var tabs2 = '../public/tabs2.html';
                        socket.emit('clear',tabs2);
                    }else{
                        var bbi = '비밀번호가 틀렸습니다.';
                        socket.emit('bbi',bbi);
                    }
                });
            }
        });
    });

    // 저장방식
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

app.get('/public', function(req,res) {
    res.cookie('id',12,{maxAge:1000,path:'/public/'});
    res.redirect('/public/tabs2.html');
});

});