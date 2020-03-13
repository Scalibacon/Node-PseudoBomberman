let createBoard = require('../../app/models/board');
let playerModel = require('../../app/models/player');

module.exports.createGame = function(){
	return game;
}

let game = {
	state : {
		board_size : {x: 17, y: 11},
		board : [],
		players : {},
		bombs : [],
		explosions : [],
		itens : [],
	},

	io : null,

	startGame : function(){

		this.state.board = createBoard();

		let time = 100;
		setInterval(function(){
			updateGame(time);
		}, time);		
	},

	addPlayer : function(socketId){
		let x, y;
		switch(Object.keys(this.state.players).length){
			case 0:
				x = 0;
				y = 0;
				break;
			case 1: 
				x = 16;
				y = 0;
				break;
			case 2:
				x = 0;
				y = 10;
				break;
			case 3:
				x = 16;
				y = 10;
				break;
			default:
				x = 0;
				y = 0;
		}

		let player = playerModel.createPlayer(socketId, x, y);

		this.state.players[socketId] = player;
	},

	setIo : function(io){
		this.io = io;
	},

	makeAnAction : function(command){
		let action = player_actions[command.keyPressed];

		if(action){
			action(command.player);
		}
	}
}

function updateGame(time){	
	bombTimer(time);
	checkExplosionHit();
	checkPlayerTouch();
	explosionTimer(time);

	updateClientState(game.state);	
}

function updateClientState(state){
	game.io.emit('updateState', state);
}

function checkPlayerTouch(){
	for(let playerId in game.state.players){
		let player = game.state.players[playerId];	

		let board_slot = game.state.board[player.y][player.x];

		if(board_slot.obj == 'explosion'){
			if(player.status != "burning"){
				player.status = "burning";
				console.log(`${playerId} was burned :O`);
			}
		}
	}
}

function bombTimer(time){
	for(let index in game.state.bombs){
		let bomb = game.state.bombs[index];

		if(bomb.time > 0){
			bomb.time -= time;
		} else {
			explode(bomb);
		}
	}
}

function explosionTimer(time){
	for(let index in game.state.explosions){
		let explosion = game.state.explosions[index];

		if(explosion.time > 0){
			explosion.time -= time;
		} else {
			removeExplosion(explosion);
		}
	}
}

function removeExplosion(explosion){
	const index = game.state.explosions.indexOf(explosion);
	game.state.explosions.splice(index, 1);

	for(let i = 0; i < explosion.ranges.length; i++){
		game.state.board[explosion.ranges[i].y][explosion.ranges[i].x].obj = 'empty';
	}	
}

function checkExplosionHit(){
	for(let index in game.state.explosions){
		let explosion = game.state.explosions[index];

		for(let range_index in explosion.ranges){
			let range = explosion.ranges[range_index];

			let board_slot = game.state.board[range.y][range.x];

			if(board_slot.bomb){
				explode(board_slot.bomb);
			}
		}
	}
}

function explode(bomb){
	removeBomb(bomb);

	var explosion = {
		power : bomb.power,
		center : {x : bomb.x, y : bomb.y},
		user : bomb.user,
		time : 750
	}

	explosion.ranges = calculateExplosionRange(explosion);
	game.state.explosions.push(explosion);
}

function removeBomb(bomb){
	const index = game.state.bombs.indexOf(bomb);
	game.state.board[bomb.y][bomb.x].bomb = null;
	game.state.bombs.splice(index, 1);
}

function calculateExplosionRange(explosion){
	let factorX = [1, -1, 0, 0];
	let factorY = [0, 0, 1, -1];

	let ranges = [];

	ranges.push(explosion.center);
	game.state.board[explosion.center.y][explosion.center.x].obj = 'explosion';

	for(let factor = 0; factor < 4; factor++){
		for(let i = 1; i <= explosion.power; i++){
			let next = {x: explosion.center.x + (i * factorX[factor]), y: explosion.center.y + (i * factorY[factor])};
			let ret = checkExplosionRange(next);
			if(ret.canExplode){
				ranges.push(next);
				game.state.board[next.y][next.x].obj = 'explosion';
				if(ret.stop){
					break;
				}
			} else {
				break;
			}
		}
	}	

	return ranges;
}

function checkExplosionRange(next){
	var ret = {
		canExplode : false, 
		stop : true
	};

	if(next.x < 0 || next.x >= 17 || next.y < 0 || next.y >= 11){
		return ret;
	}

	if(game.state.board[next.y][next.x].obj == 'steel'){
		return ret;
	}

	if(game.state.board[next.y][next.x].obj == 'explosion'){
		ret.stop = false;
		return ret;
	}

	if(game.state.board[next.y][next.x].obj == 'block'){
		ret.canExplode = true;
		return ret;
	}

	ret.canExplode = true;
	ret.stop = false;

	return ret;
}

const player_actions = {
	ArrowUp : function(playerId){
		let player = game.state.players[playerId];			

		player.dir = 'up';	

		let destination = {
			x : player.x,
			y : player.y - 1
		}

		if(checkDestination(destination)){
			updatePosition(player, function(){
				player.y--;
			});
		}
	},

	ArrowDown : function(playerId){
		let player = game.state.players[playerId];			

		player.dir = 'down';	

		let destination = {
			x : player.x,
			y : player.y + 1
		}

		if(checkDestination(destination)){
			updatePosition(player, function(){
				player.y++;
			});
		}
	},

	ArrowRight : function(playerId){
		let player = game.state.players[playerId];			

		player.dir = 'right';	

		let destination = {
			x : player.x + 1,
			y : player.y
		}

		if(checkDestination(destination)){
			updatePosition(player, function(){
				player.x++;
			});
		}
	},

	ArrowLeft : function(playerId){
		let player = game.state.players[playerId];			

		player.dir = 'left';

		let destination = {
			x : player.x - 1,
			y : player.y
		}

		if(checkDestination(destination)){
			updatePosition(player, function(){
				player.x--;
			});
		}
	},

	" " : function(playerId){		
		let player = game.state.players[playerId];

		if(checkBombs(playerId) >= player.max){
			return;
		}

		if(game.state.board[player.y][player.x].bomb){
			return;
		}

		//check if the spot can have a bomb
		if(game.state.board[player.y][player.x].obj != 'depoistrocaisso'){
			let bomb = {
				user : playerId,
				x : player.x,
				y : player.y,
				time : 3000,
				power : player.power
			}
			game.state.bombs.push(bomb);
			game.state.board[bomb.y][bomb.x].bomb = bomb;
		}
	}
}

function checkBombs(playerId){
	let n_bombs = 0;

	for(let index in game.state.bombs){
		let bomb = game.state.bombs[index];
		if(bomb.user == playerId){
			n_bombs++;
		}
	}

	return n_bombs;
}

function checkDestination(destination){
	//border
	if(destination.x < 0 || destination.x >= 17 || destination.y < 0 || destination.y >= 11){
		return false;
	}

	//steel
	if(game.state.board[destination.y][destination.x].obj == "steel"){
		return false;
	} 

	//block
	if(game.state.board[destination.y][destination.x].obj == "block"){
		return false;
	} 

	//bombs
	if(game.state.board[destination.y][destination.x].bomb){
		return false;
	} 

	return true;
}

function updatePosition(player, after){
	if(player.status != "idle"){
		return;
	}

	player.status = "walking";

	var delay = 200 / player.speed;

	setTimeout(function(){
		after();
		setTimeout(function(){
			if(player.status != "burning"){
				player.status = "idle"; 
			}
		}, delay);
	}, delay);
}
