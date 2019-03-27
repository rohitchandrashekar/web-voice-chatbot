'use strict';

const socket = io();

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector('button').addEventListener('click', () => {
    recognition.start();
});

recognition.addEventListener('speechstart', () => {
    console.log('Speech has been detected.');
});

recognition.addEventListener('result', (e) => {
    console.log('Result has been detected.');

    let last = e.results.length - 1;
    let text = e.results[last][0].transcript;

    addUserChatMessage(text);
    console.log('Confidence: ' + e.results[0][0].confidence);

    socket.emit('user says', text);
});

recognition.addEventListener('speechend', () => {
    recognition.stop();
});

recognition.addEventListener('error', (e) => {
    outputBot.textContent = 'Error: ' + e.error;
});

function synthVoice(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = text;
    synth.speak(utterance);
}

socket.on('bot reply', function (replyText) {
    synthVoice(replyText);
    if (replyText == '') replyText = '(No answer...)';
    addBotChatMessage(replyText);
});

function addUserChatMessage(message) {
    let currentContent = document.getElementById('chat-content');
    let userContentContainer = document.createElement('div');
    userContentContainer.className = 'container';
    let userContentIcons = document.createElement('i');
    userContentIcons.className = 'fas fa-user-circle'
    let userContentPara = document.createElement('p');
    userContentPara.innerText = message;
    let userContentTime = document.createElement('span');
    userContentTime.className = 'time-right';
    userContentTime.innerText = new Date();
    userContentContainer.appendChild(userContentIcons);
    userContentContainer.appendChild(userContentPara);
    userContentContainer.appendChild(userContentTime);
    currentContent.appendChild(userContentContainer);
}

function addBotChatMessage(message) {
    let currentContent = document.getElementById('chat-content');
    let botContentContainer = document.createElement('div');
    botContentContainer.className = 'container darker';
    let botContentIcons = document.createElement('i');
    botContentIcons.className = 'fas fa-robot right'
    let botContentPara = document.createElement('p');
    botContentPara.innerText = message;
    let botContentTime = document.createElement('span');
    botContentTime.className = 'time-left';
    botContentTime.innerText = new Date();
    botContentContainer.appendChild(botContentIcons);
    botContentContainer.appendChild(botContentPara);
    botContentContainer.appendChild(botContentTime);
    currentContent.appendChild(botContentContainer);
}