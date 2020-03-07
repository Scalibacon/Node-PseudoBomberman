import {startDrawing} from './draw.js';
import {createKeyboardListener} from './input.js';
import {makeAnAction, game} from './game.js';

function renderCanvas(){
	//generate canvas
	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'game_canvas');
	canvas.setAttribute('width', 850);
	canvas.setAttribute('height', 550);
	document.body.appendChild(canvas);

	//keyboard starts to listen
	const keyboardListener = createKeyboardListener();

	//set game observer
	keyboardListener.subscribe(makeAnAction);

	//generate empty board
	//game.generateEmptyBoard();

	//generate default board
	game.generateDefaultBoard();

	//start timer of the bombs
	game.startBombTimer();

	//start drawing
	startDrawing();
}

renderCanvas();