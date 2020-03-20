let gameCreator = require('../../app/models/game');

let connected = {};

module.exports.getSocket = function(io){

	const gameIO = io.of('/game');

	gameIO.on('connection', function(socket){

		console.log(`${socket.id} conectou`);

		if(connected.game == undefined){
			console.log("Criando game...")
			connected.game = gameCreator.createGame();
			connected.game.setIo(gameIO);
			connected.game.startGame();						
		}

		connected.game.addPlayer(socket.id);

		socket.on('sendCommand', function(command){
			connected.game.makeAnAction(command);
		});	

		socket.on('disconnect', function(){
			delete connected.game.state.players[socket.id];
		});
	});

	return io;
}