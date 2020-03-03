import {game} from './game.js';

export function startDrawing(){
	drawBoard();

	drawPlayers();

	//console.log(`Draw scali: ${game.players.scali.x}`);

	requestAnimationFrame(startDrawing);
}

function drawBoard(){
	//console.log("Drawing board");
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let i = 0; i < game.board_size.y / 20; i++){
		for(let j = 0; j < game.board_size.x / 20; j++){
			/* Epilepsia simulator xD
			ctx.fillStyle = `rgba(${Math.floor(Math.random() * 254 + 1)}, ${Math.floor(Math.random() * 254 + 1)}, ${Math.floor(Math.random() * 254 + 1)}, 1)`;
			ctx.fillRect(j * 20, i * 20, 20, 20);
			*/

			ctx.fillStyle = `rgba(60,240,180,0.5)`;
			ctx.fillRect(j * 20, i * 20, 20, 20);

			ctx.lineWidth = 1;
			ctx.strokeStyle = `rgba(0,0,200,0.5)`;
			ctx.strokeRect(j * 20, i * 20, 20, 20);
		}
	}
}

function drawPlayers(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in game.players){
		let player = game.players[index];

		/*
		if(player.status == "walking"){
			continue;
		}
		*/

		ctx.fillStyle = `orange`;
		ctx.fillRect(player.x * 20, player.y * 20, 20, 20);
	}
}

export function drawWalkingAnimation(playerId, direction){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');
}
