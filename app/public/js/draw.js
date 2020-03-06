import {game} from './game.js';

export function startDrawing(){
	drawBoard();
	drawBombs();
	drawPlayers();

	//console.log(`Draw scali: ${game.players.scali.x}`);

	requestAnimationFrame(startDrawing);
}

function drawBoard(){
	//console.log("Drawing board");
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let i = 0; i < game.board_size.y; i++){
		for(let j = 0; j < game.board_size.x; j++){
			/* Epilepsia simulator xD
			ctx.fillStyle = `rgba(${Math.floor(Math.random() * 254 + 1)}, ${Math.floor(Math.random() * 254 + 1)}, ${Math.floor(Math.random() * 254 + 1)}, 1)`;
			ctx.fillRect(j * 20, i * 20, 20, 20);
			*/

			//empty
			if(game.board[i][j] == 0){
				ctx.fillStyle = `rgba(60,240,180,1)`;
			}
			//obsidian
			if(game.board[i][j] == 1){
				ctx.fillStyle = `rgba(50,0,50,1)`;
			}

			ctx.fillRect(j * 50, i * 50, 50, 50);
		}
	}
}

function drawPlayers(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in game.players){
		let player = game.players[index];

		ctx.fillStyle = `orange`;
		ctx.fillRect(player.x * 50 + 5, player.y * 50 + 5, 40, 40);
	}
}

function drawBombs(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in game.bombs){
		let bomb = game.bombs[index];

		ctx.fillStyle = `green`;
		ctx.beginPath();
		ctx.arc(bomb.x * 50 + 25, bomb.y * 50 + 25, 25, 0, 2 * Math.PI);
		ctx.fill();
	}
}