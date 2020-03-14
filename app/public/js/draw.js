//import {game} from './backend/game.js';
import {socket} from './connection.js';

let game = null;

export function startDrawing(){
	if(game != null){
		drawBoard();
		drawBombs();
		drawExplosion();
		drawPlayers();
	}

	requestAnimationFrame(startDrawing);
}

export function updateGameState(state){
	game = state;
}

function drawBoard(){
	//console.log("Drawing board");
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let i = 0; i < 11; i++){
		for(let j = 0; j < 17; j++){

			ctx.fillStyle = `rgba(60,240,180,1)`;

			//steel
			if(game.board[i][j].obj == 'steel'){
				ctx.fillStyle = `rgba(50,0,50,1)`;
			}

			//block
			if(game.board[i][j].obj == 'block'){
				ctx.fillStyle = `brown`;
			}

			//ashe
			if(game.board[i][j].obj == 'ash'){
				ctx.fillStyle = `rgba(255, 255, 102, 1)`;
			}

			//item
			if(game.board[i][j].obj == 'item'){
				ctx.fillStyle = `rgba(255, 51, 153, 1)`;
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

		if(player.status != "burning"){
			if(player.id == socket.id){
				ctx.fillStyle = 'rgba(0,153,255,1)';
			} else {
				ctx.fillStyle = `orange`;
			}
		} else {
			ctx.fillStyle = `gray`;
		}

		ctx.fillRect(player.x * 50 + 5, player.y * 50 + 5, 40, 40);
	}
}

function drawBombs(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in game.bombs){
		let bomb = game.bombs[index];
		let time = parseInt(bomb.time / 1000) + 1;

		ctx.fillStyle = `green`;
		ctx.beginPath();
		ctx.arc(bomb.x * 50 + 25, bomb.y * 50 + 25, 25, 0, 2 * Math.PI);
		ctx.fill();

		ctx.font = "25px serif";
		ctx.fillStyle = "black";
		ctx.fillText(time, bomb.x * 50 + 20, bomb.y * 50 + 35);
	}
}

function drawExplosion(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in game.explosions){
		let explosion = game.explosions[index];

		ctx.fillStyle = "red";

		for(let range_index in explosion.ranges){
			let range = explosion.ranges[range_index];
			ctx.fillRect(range.x * 50, range.y * 50, 50, 50);
		}
	}

}