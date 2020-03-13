import {updateGameState} from './draw.js'; 
let socket;

export function connectToGameSocket(){
	//socket = io("http://localhost");
	socket = io("http://192.168.1.137"); //localhost

	socket.on('updateState', function(data){
		updateGameState(data);
	});
}

export function sendCommand(command){
	command.player = socket.id;
	socket.emit('sendCommand', command);
}

export {socket};