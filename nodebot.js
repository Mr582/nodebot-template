// Of course we need the socket.io-client library
var io = require('socket.io-client');
// We need the fs library to be explicitly required for config.json to be read
var fs = require('fs');
// This reads the contents of config.json and parses it into an array.
var config = JSON.parse(fs.readFileSync('config.json').toString());
// This connects to the IP and port specified in config.json
// You can get the botkey parameter (config.json:key) from using /botkey in Nodechat
var socket = io.connect('http://' + config.ip + ':' + config.port + '?botkey=' + config.key);
var isModerator;

// The 'connect' event is built-in to socket.io-client
socket.on('connect', function() { // This tells us when we actually connect.
	console.log('Connected to ' + config.ip + ':' + config.port); // You can put initial calls to socket.emit here.
});

socket.on('connect_failed', function() { // This is so that a failed connection won't kill the program silently.
	console.log('Connection to ' + config.ip + ':' + config.port + ' failed.');
});

// Handles the 'loginStatus' part of the protocol
socket.on('loginStatus', function(data) {
	if (data.isLoggedIn !== true) { // It's no good if the key is not valid, so we check for that
		console.log('Error: user is banned or key is invalid.');
		return;
	}
	console.log('Connection successful.');
	if (data.isForumModerator === true) { // We want to see if our bot is a moderator, and if so, keep track of that.
		isModerator = true;
	}
});

// Handles the main part of the protocol, the 'message' header
socket.on('message', function(data) {
	if (data.isBuffer) return; // Don't handle messages that are sent as part of the buffer
});