//import {game} from './backend/game.js';
import {socket} from './connection.js';

let state = null;
let playerInGrass = false;

export function startDrawing(){
	if(state != null){
		playerInGrass = isPlayerInGrass();
		drawScore();
		drawBoard();
		drawBombs();
		drawItens();
		drawExplosion();
		drawPlayers();
	}

	requestAnimationFrame(startDrawing);
}

export function updateGameState(stt){
	state = stt;
}

function isPlayerInGrass(){
	for(let index in state.players){
		let player = state.players[index];

		if(player.id == socket.id){
			if(state.board[player.y][player.x].grass){
				return true;
			} else {
				return false;
			}
		}
	}
	return false;
}


function drawScore(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');
	ctx.fillStyle = `rgba(1,1,1,1)`;
	ctx.fillRect(0, 550, 850, 50);

	ctx.fillStyle = 'rgba(0,153,255,1)';
	ctx.font = "30px calibri";
	ctx.fillText(`${getTime(state.time)}`, 750, 585);

	for(let index in state.players){
		let player = state.players[index];

		if(player.id == socket.id){				
			ctx.fillText(`Speed: ${player.speed}`, 20, 585);
			ctx.fillText(`Power: ${player.power}`, 150, 585);
			ctx.fillText(`Max: ${player.max_bombs}`, 280, 585);

			ctx.fillText(`${player.name}`, 390, 585);
			ctx.fillText(`${player.skill}`, 540, 585);
		}
	}
}

function getTime(milis){
	let mins = 0;
	let secs = 0;
	secs = milis / 1000;
	if(secs / 60 >= 0){
		mins = parseInt(secs / 60);
		secs = parseInt(secs % 60);
	}
	if(secs < 10){
		secs = `0${secs}`;
	}
	if(mins < 10){
		mins = `0${mins}`;
	}
	return `${mins}:${secs}`;
}

function drawBoard(){
	//console.log("Drawing board");
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let i = 0; i < 11; i++){
		for(let j = 0; j < 17; j++){

			//ground
			ctx.fillStyle = `rgba(60,240,180,1)`;
			ctx.fillRect(j * 50, i * 50, 50, 50);					

			//steel
			if(state.board[i][j].obj == 'steel'){
				ctx.fillStyle = `rgba(50,0,50,1)`;
			}

			//block
			if(state.board[i][j].obj == 'block'){
				ctx.fillStyle = `brown`;
			}

			//ashe
			if(state.board[i][j].obj == 'ash'){
				ctx.fillStyle = `rgba(255, 255, 102, 1)`;
			}

			ctx.fillRect(j * 50, i * 50, 50, 50);

			//grass
			if(state.board[i][j].grass){
				if(playerInGrass){
					ctx.fillStyle = `rgba(126, 247, 101, 0.5)`;
				} else {
					ctx.fillStyle = `rgba(126, 247, 101, 1)`
				}
				ctx.fillRect(j * 50, i * 50, 50, 50);				
			}			
		}
	}
}

function drawItens(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in state.itens){
		let item = state.itens[index];

		if(state.board[item.y][item.x].grass && !playerInGrass){
			continue;
		}

		ctx.fillStyle = `rgba(208, 237, 245, 1)`;
		ctx.fillRect(item.x * 50, item.y * 50, 50, 50);

		ctx.beginPath();
		ctx.lineWidth = "10";

		if(item.type == 'speed'){
			ctx.strokeStyle = `rgba(153, 236, 247, 1)`;
		} else 
		if(item.type == 'max_bombs'){
			ctx.strokeStyle = `rgba(50, 69, 71, 1)`;
		} else 
		if(item.type == 'power'){
			ctx.strokeStyle = `rgba(255, 148, 8, 1)`;
		}
		ctx.rect(item.x * 50 + 5, item.y * 50 + 5, 40, 40);
		ctx.stroke();
	}
}

function drawPlayers(){
	let canvas = document.getElementById('game_canvas');
	let ctx = canvas.getContext('2d');

	for(let index in state.players){
		let player = state.players[index];

		if(state.board[player.y][player.x].grass && !playerInGrass){
			continue;
		}

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

	for(let index in state.bombs){
		let bomb = state.bombs[index];

		if(state.board[bomb.y][bomb.x].grass && !playerInGrass){
			continue;
		}

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

	for(let index in state.explosions){
		let explosion = state.explosions[index];

		ctx.fillStyle = "red";

		for(let range_index in explosion.ranges){
			let range = explosion.ranges[range_index];

			if(state.board[range.y][range.x].grass && !playerInGrass){
				continue;
			}

			ctx.fillRect(range.x * 50, range.y * 50, 50, 50);
		}
	}
}