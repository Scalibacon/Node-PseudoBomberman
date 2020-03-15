import {startDrawing} from './draw.js';
import {createKeyboardListener} from './input.js';
import {connectToGameSocket, sendCommand} from './connection.js';

function renderCanvas(){
	//generate canvas
	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'game_canvas');
	canvas.setAttribute('width', 850);
	canvas.setAttribute('height', 600);
	document.body.appendChild(canvas);

	//keyboard starts to listen
	const keyboardListener = createKeyboardListener();

	//subscribes connection's sendCommand to keyboard
	keyboardListener.subscribe(sendCommand);
	
	//exactly what the name means
	connectToGameSocket();

	//start drawing game state to canvas
	startDrawing();
}

renderCanvas();