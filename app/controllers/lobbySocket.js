let rooms = [];
let lobbyIO;

module.exports.getSocket = function(io){
	lobbyIO = io.of('/lobby');

	lobbyIO.on('connection', function(socket){
		console.log('Alguém entrou no lobby');
		broadcastUpdate();

		socket.on('enterRoom', function(data){
			exitRoom(data.player, socket);
			if(enterRoom(data)){
				socket.join(data.room);
			}
			broadcastUpdate();
		});

		socket.on('exitRoom', function(data){
			exitRoom(data.player, socket);
			broadcastUpdate();
		});

		socket.on('disconnect', function(data){
			let player = {id : socket.id};
			exitRoom(player, socket);
			broadcastUpdate();
		});

		socket.on('startGame', function(room){
			rooms[room].state = 'playing';
			let data = {
				room : rooms[room],
				idRoom : room
			}
			lobbyIO.to(room).emit('startGame', data);
		});
	});

	return io;
}

function enterRoom(data){
	let room = rooms[data.room];
	let slot = checkRoomSlot(room);

	if(!slot){
		return false;
	} else {		
		room.players[slot] = data.player;
		return true;
	}
}

function exitRoom(player, socket){
	for(let room_index in rooms){
		let room = rooms[room_index];
		for(let play_index in room.players){
			let play = room.players[play_index];
			if(play && play.id === player.id){
				socket.leave(room_index);
				realocatePlayers(room, play_index);				
				return;
			}
		}
	}
}

function realocatePlayers(room, exiting){
	console.log(room);
	for(let i = parseInt(exiting); i < 4; i++){
		let aux = room.players[i + 1];
		console.log(aux);
		room.players[i+1] = null;
		room.players[i] = aux;
	}
}

function broadcastUpdate(){
	lobbyIO.emit('updateLobby', rooms);
}

function checkRoomSlot(room){
	for(let i = 1; i <= 4; i++){
		if(room.players[i] == null){
			return i;
		}
	}
	return false;
}

function startRooms(){
	for(let i = 0; i < 4; i++){
		rooms[i] = resetRoom(rooms[i]);
	}
}

function resetRoom(room){
	room = {
		players : {
			"1" : null,
			"2" : null,
			"3" : null,
			"4" : null
		},
		state : 'waiting'
	}

	return room;
}

startRooms();