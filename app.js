/**
 * Created by bapaydin on 04.03.2017.
 */
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var Twit = require('twit');

app.use(express.static(__dirname + '/node_modules'));
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/index.html');
});

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000
});

io.on('connection', function (socket) {
    if(socket){
        console.log("Client connected");
        var stream = T.stream('statuses/filter', { track: process.env.HASHTAG })

        stream.on('tweet', function (tweet) {
            console.log(tweet);
            socket.emit('tweet',tweet);
        })
    }
});

server.listen(4200);