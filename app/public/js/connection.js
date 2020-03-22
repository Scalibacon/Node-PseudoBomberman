import {updateGameState} from './draw.js'; 
let socket;

export function connectToGameSocket(){
	//socket = io("http://localhost");
	socket = io("/game"); //localhost	

	socket.on('connect', function(){
		enterRoom();
	})

	socket.on('updateState', function(data){
		updateGameState(data);
	});	
}

export function sendCommand(command){
	command.player = JSON.parse(localStorage.getItem("player"));
	socket.emit('sendCommand', command);
}

function enterRoom(){
	let player = JSON.parse(localStorage.getItem("player"));
	player.id = socket.id;
	localStorage.setItem("player", JSON.stringify(player));
	
	socket.emit('enterRoom', player);
}

export {socket};