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

	const gameIO = io.of('/game');

	gameIO.on('connection', function(socket){

		console.log(`${socket.id} conectou`);		

		//depois validar se pode entrar
		socket.on('enterRoom', function(data){
			socket.join(data.room);
			rooms[data.room].state = 'playing';

			if(rooms[data.room].game == null || rooms[data.room].game == undefined){
				console.log(`Criando game na sala ${data.room}...`)
				rooms[data.room].game = gameCreator.createGame();
				rooms[data.room].game.setIo(gameIO);
				rooms[data.room].game.startGame(data.room);						
			}
			addPlayerToRoom(data.player, data.room);
		});

		socket.on('sendCommand', function(command){
			rooms[command.room].game.makeAnAction(command);
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
		},
		state : 'waiting',
		game : null
	}

	return room;
}

function addPlayerToRoom(player, idRoom){
	for(let i = 1; i <= 4; i++){
		if(rooms[idRoom].players[i] === undefined){
			rooms[idRoom].players[i] = player;
			rooms[idRoom].game.addPlayer(player);
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