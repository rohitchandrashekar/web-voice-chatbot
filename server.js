'use strict';
const express = require('express');
const app = express();
require('dotenv').config()
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = process.env.APIAI_SESSION_ID;

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
console.log(APIAI_TOKEN)
const server = app.listen(process.env.port || 3000, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.info('Chatbot app listening at http://%s:%s in mode %s', host, port, app.settings.env);
});

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    console.log('a user connected');
});

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

io.on('connection', function (socket) {

    socket.on('user says', (text) => {
        console.log('Message: ' + text);
    });


});
