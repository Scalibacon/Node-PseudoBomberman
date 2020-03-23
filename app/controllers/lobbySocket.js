let gameSocket = require("../../app/controllers/gameSocket");

let rooms = [];
let lobbyIO;

module.exports.getSocket = function(io){
	startRooms();

	// setInterval(function(){
	// 	console.log('lobby')
	// 	console.log(rooms);
	// },5000);

	io = gameSocket.getSocket(io);

	gameSocket.subscribe(updateGameRooms);
	
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
			console.log(data.player);
		});

		socket.on('exitRoom', function(data){
			exitRoom(data.player, socket);
			broadcastUpdate();
		});

		socket.on('disconnect', function(data){
			let player = {id : socket.id};
			let room = getPlayerRoom(player);

			if(room.state === 'playing'){
				return;
			}

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
			broadcastUpdate();
		});
	});

	return io;
}

function updateGameRooms(gameRooms){
	for(let i in rooms){
		let room = rooms[i];
		for(let j in room.players){
			player = room.players[j];
			if(player && !checkPlayerInGame(player, gameRooms[i])){
				exitRoom(player);
				broadcastUpdate();
			}				
		}
	}
}

function checkPlayerInGame(player, gameRoom){
	for(let play_index in gameRoom.players){
		let gamePlayer = gameRoom.players[play_index];
		if(gamePlayer && gamePlayer.unikey === player.unikey){
			return true;
		}
	}
	return false;
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
				if(socket)
					socket.leave(room_index);				
				realocatePlayers(room, play_index);					
				if(room.players[1] == undefined && room.players[2] == undefined
					&& room.players[3] == undefined && room.players[4] == undefined){									
					rooms[room_index] = resetRoom();
					console.log(rooms[room_index])

				}			
				return;
			}
		}
	}
}

function getPlayerRoom(player){
	for(let room_index in rooms){
		let room = rooms[room_index];
		for(let play_index in room.players){
			let play = room.players[play_index];
			if(play && play.id === player.id){
				return rooms[room_index];
			}
		}
	}
	return false;
}

function realocatePlayers(room, exiting){
	for(let i = parseInt(exiting); i < 4; i++){
		let aux = room.players[i + 1];
		room.players[i+1] = undefined;
		room.players[i] = aux;
	}
}

function broadcastUpdate(){
	lobbyIO.emit('updateLobby', rooms);
}

function checkRoomSlot(room){
	for(let i = 1; i <= 4; i++){
		if(room.players[i] == undefined){
			return i;
		}
	}
	return false;
}

function startRooms(){
	for(let i = 0; i < 4; i++){
		rooms[i] = resetRoom();
	}
}

function resetRoom(){
	room = {
		players : {},
		state : 'waiting'
	}

	return room;
}