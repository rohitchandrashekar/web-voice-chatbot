'use strict';
const express = require('express');
const app = express();
const crypto = require('crypto');
require('dotenv').config()
const APIAI_TOKEN = process.env.APIAI_TOKEN;
const APIAI_SESSION_ID = crypto.randomBytes(16).toString("hex");

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
console.log(APIAI_TOKEN)
const server = app.listen(process.env.port || 3000, () => {
    var host = server.address().address;
    var port = server.address().port;

    console.info('Chatbot app listening at http://%s:%s in mode %s', host, port, app.settings.env);
});

const apiai = require('apiai')(APIAI_TOKEN);

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

        // Get a reply from API.ai
        let apiaiReq = apiai.textRequest(text, {
             sessionId: APIAI_SESSION_ID
         });
        apiaiReq.on('response', (response) => {
             let aiText = response.result.fulfillment.speech;
             console.log('Bot reply: ' + aiText);
             socket.emit('bot reply', aiText);
         });
        apiaiReq.on('error', (error) => {
             console.log(error);
         });
        apiaiReq.end();

    });


});
