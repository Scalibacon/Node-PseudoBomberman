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
	command.room = JSON.parse(localStorage.getItem("room"));
	socket.emit('sendCommand', command);
}

function enterRoom(){
	let room = JSON.parse(localStorage.getItem("room"));
	let player = JSON.parse(localStorage.getItem("player"));
	player.id = socket.id;
	localStorage.setItem("player", JSON.stringify(player));

	player.skill = JSON.parse(localStorage.getItem("skill"));	
	socket.emit('enterRoom', {player, room});
}

export {socket};