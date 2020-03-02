import {startDrawing} from './draw.js';
import {createKeyboardListener} from './input.js';
import {makeAnAction, game} from './game.js';

function renderCanvas(){
	//generate canvas
	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'game_canvas');
	canvas.setAttribute('width', 600);
	canvas.setAttribute('height', 400);
	document.body.appendChild(canvas);

	//keyboard starts to listen
	const keyboardListener = createKeyboardListener();

	//set game observer
	keyboardListener.subscribe(makeAnAction);

	//generate default board
	game.generateEmptyBoard();

	//start drawing
	startDrawing();
}

renderCanvas();