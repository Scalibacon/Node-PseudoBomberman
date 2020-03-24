let gameCreator = require('../../app/models/game');

let rooms = {};

let observers = [];

function notifyAll(event){
	observers.forEach(function(observer){
		observer(event);
	});
}

module.exports.subscribe = function(observer){
	observers.push(observer);
}

module.exports.getSocket = function(io){
	startRooms();

	// setInterval(function(){
	// 	console.log('game')
	// 	console.log(rooms);
	// },5000);

	const gameIO = io.of('/game');

	gameIO.on('connection', function(socket){

		console.log(`${socket.id} conectou`);		

		//depois validar se pode entrar
		socket.on('enterRoom', function(player){
			socket.join(player.room);
			rooms[player.room].state = 'playing';

			if(rooms[player.room].game == null || rooms[player.room].game == undefined){
				console.log(`Criando game na sala ${player.room}...`)
				rooms[player.room].game = gameCreator.createGame();
				rooms[player.room].game.setIo(gameIO);
				rooms[player.room].game.startGame(player.room);						
			}
			addPlayerToRoom(player);
		});

		socket.on('sendCommand', function(command){
			rooms[command.player.room].game.makeAnAction(command);
		});	

		socket.on('disconnect', function(){
			removePlayer(socket);
			notifyAll(rooms);
		});
	});

	return io;
}

function startRooms(){
	for(let i = 0; i < 4; i++){
		rooms[i] = resetRoom(rooms[i]);
	}
}

function resetRoom(){
	room = {
		players : {
			// "1" : null,
			// "2" : null,
			// "3" : null,
			// "4" : null
		},
		state : 'waiting',
		game : null
	}

	return room;
}

function addPlayerToRoom(player){
	for(let i = 1; i <= 4; i++){
		if(rooms[player.room].players[i] === undefined){
			rooms[player.room].players[i] = player;
			rooms[player.room].game.addPlayer(player);
			return true;
		}
	}

	return false;
}

function removePlayer(socket){
	for(let room_index in rooms){
		let room = rooms[room_index];
		for(let play_index in room.players){
			let player = room.players[play_index];
			if(player && player.id == socket.id){
				delete rooms[room_index].players[play_index];
				rooms[room_index].game.removePlayer(player.id);

				if(Object.keys(rooms[room_index].players).length <= 0){
					rooms[room_index] = resetRoom();
					console.log(`Sala ${room_index} resetada`);
				}
			}
		}
	}
}