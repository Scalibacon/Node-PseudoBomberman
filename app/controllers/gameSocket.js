let gameCreator = require('../../app/models/game');
let io;

let connected = {};

module.exports.getSocket = function(server){

	io = require('socket.io').listen(server);

	io.on('connection', function(socket){

		console.log(`${socket.id} conectou`);

		if(connected.game == undefined){
			console.log("Criando game...")
			connected.game = gameCreator.createGame();
			connected.game.setIo(io);
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

/* ainda não usado
function getPeerGroup(){
	for(let index in connected){
		let group = connected[index];
		if(group.length < 4){
			return {
				index : index
				position : group.length
			};
		}
		if(index == connected.length){
			return {
				index : index + 1,
				position : 1
			};
		}
	}
}
*/