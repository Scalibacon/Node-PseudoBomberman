import {teste} from './draw.js';
import {createKeyboardListener} from './input.js';

const game_settings = {
	canvas_width: 600,
	canvas_height: 400
}

function renderCanvas(){
	//generate canvas
	var canvas = document.createElement('canvas');
	canvas.setAttribute('id', 'game_canvas');
	canvas.setAttribute('width', game_settings.canvas_width);
	canvas.setAttribute('height', game_settings.canvas_height);
	document.body.appendChild(canvas);

	//keyboard starts to listen
	const keyboardListener = createKeyboardListener();

	//teste
	teste();
}

renderCanvas();