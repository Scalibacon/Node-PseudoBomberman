let gameCreator = require('../../app/models/game');

module.exports.getSocket = function(server){

	let io = require('socket.io').listen(server);

	io.on('connection', function(socket){

		console.log("Alguém connectou");
		let game = gameCreator.createGame();
		game.startGameUpdate();
		console.log(game);

	});

	return io;
}