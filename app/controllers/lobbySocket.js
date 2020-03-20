let rooms = [];
let lobbyIO;

module.exports.getSocket = function(io){
	lobbyIO = io.of('/lobby');

	lobbyIO.on('connection', function(socket){
		console.log('Alguém entrou no lobby');
		broadcastUpdate();

		socket.on('enterRoom', function(data){
			data.player.socket = socket.id;
			enterRoom(data);
			broadcastUpdate();
		});

		socket.on('disconnect', function(data){
			let player = {socket : socket.id};
			exitRoom(player);
			broadcastUpdate();
		})
	});

	return io;
}

function enterRoom(data){
	exitRoom(data.player);

	let room = rooms[data.room];
	let slot = checkRoomSlot(room);

	if(!slot){
		return;
	} else {		
		room['player'+slot] = data.player;
	}
}

function exitRoom(player){

	for(let room_index in rooms){
		let room = rooms[room_index];
		for(let play_index in room){
			let play = room[play_index];
			if(play && play.socket === player.socket){
				room[play_index] = null;
				return;
			}
		}
	}
}

function broadcastUpdate(){
	lobbyIO.emit('updateLobby', rooms);
}

function checkRoomSlot(room){
	for(let i = 1; i <= 4; i++){
		if(room['player'+i] == null){
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
		player1 : null,
		player2 : null,
		player3 : null,
		player4 : null
	}

	return room;
}

startRooms();