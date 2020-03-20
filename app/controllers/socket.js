let gameSocket = require("../../app/controllers/gameSocket");
let lobbySocket = require("../../app/controllers/lobbySocket");

module.exports.getSocket = function(server){
	let io = require('socket.io').listen(server);

	io = gameSocket.getSocket(io);
	
	io = lobbySocket.getSocket(io);
}