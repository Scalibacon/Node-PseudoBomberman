let lobbySocket = require("../../app/controllers/lobbySocket");

module.exports.getSocket = function(server){
	let io = require('socket.io').listen(server);
	
	io = lobbySocket.getSocket(io);
}