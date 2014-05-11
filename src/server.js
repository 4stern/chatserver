var config = require('./config'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    chat = require('./modules/chat.js');

server.listen(config.web.port);

app.use(express.static(__dirname + '/www/'));

chat.start(io);
