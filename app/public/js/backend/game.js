export const game = {
	board : [],

	board_size : {x: 17, y: 11},

	players : {
		scali : {x: 0, y: 0, speed: 1, max: 3, power: 2, status: 'idle', dir: 'right'}
	},

	bombs : [],

	explosions : [],

	generateDefaultBoard : function(){
		this.board = initializeBiArray(this.board, 11);
		for(let i = 0; i < 11; i++){
			for(let j = 0; j < 17; j++){
				this.board[i][j] = {
					obj : 'empty',
					bomb : null
				}

				if((j + 1) % 2 == 0 && (i + 1) % 2 == 0){
					this.board[i][j].obj = 'steel';
				}
			}
		}

		this.generateRandomBlocks();
	},

	generateRandomBlocks : function(){
		for(let i = 0; i < 11; i++){
			for(let j = 0; j < 17; j++){

				if(game.board[i][j].obj == "steel"){
					continue;
				} else

				if(i == 0){
					if(j == 0 || j == 1 || j == 15){
						continue;
					}
				} else

				if(i == 1){
					if(j == 0 || j == 16){
						continue;
					}
				} else

				if(i == 9){
					if(j == 0 || j == 1){
						continue;
					}
				} else

				if(i == 16){
					if(j == 9 || j == 10){

					}
				} else

				if(i == 8 && j == 0 || i == 15 && j == 10){
					continue;
				}			

				let random = Math.floor(Math.random() * 100);
				if(random >= 50){
					game.board[i][j].obj = "block";
				}
			}
		}
	},

	startGameUpdate : function(){
		let time = 100;
		setInterval(function(){
			updateGame(time);
		}, time);
	}
}

function initializeBiArray(arr, lines){
	for(let i = 0; i < lines; i++){
		arr[i] = [];
	}
	return arr;
}

function updateGame(time){
	bombTimer(time);
	checkExplosionHit();
	checkPlayerTouch();
	explosionTimer(time);	
}

function checkPlayerTouch(){
	for(let playerId in game.players){
		let player = game.players[playerId];	

		let board_slot = game.board[player.y][player.x];

		if(board_slot.obj == 'explosion'){
			if(player.status != "burning"){
				player.status = "burning";
				console.log(`${playerId} was burned :O`);
			}
		}
	}
}

function bombTimer(time){
	for(let index in game.bombs){
		let bomb = game.bombs[index];

		if(bomb.time > 0){
			bomb.time -= time;
		} else {
			explode(bomb);
		}
	}
}

function explosionTimer(time){
	for(let index in game.explosions){
		let explosion = game.explosions[index];

		if(explosion.time > 0){
			explosion.time -= time;
		} else {
			removeExplosion(explosion);
		}
	}
}

function removeExplosion(explosion){
	const index = game.explosions.indexOf(explosion);
	game.explosions.splice(index, 1);

	for(let i = 0; i < explosion.ranges.length; i++){
		game.board[explosion.ranges[i].y][explosion.ranges[i].x].obj = 'empty';
	}	
}

function checkExplosionHit(){
	for(let index in game.explosions){
		let explosion = game.explosions[index];

		for(let range_index in explosion.ranges){
			let range = explosion.ranges[range_index];

			let board_slot = game.board[range.y][range.x];

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
		time : 1500
	}

	explosion.ranges = calculateExplosionRange(explosion);
	game.explosions.push(explosion);
}

function removeBomb(bomb){
	const index = game.bombs.indexOf(bomb);
	game.board[bomb.y][bomb.x].bomb = null;
	game.bombs.splice(index, 1);
}

function calculateExplosionRange(explosion){
	let factorX = [1, -1, 0, 0];
	let factorY = [0, 0, 1, -1];

	let ranges = [];
	ranges.push(explosion.center);

	for(let factor = 0; factor < 4; factor++){
		for(let i = 1; i <= explosion.power; i++){
			let next = {x: explosion.center.x + (i * factorX[factor]), y: explosion.center.y + (i * factorY[factor])};

			let ret = checkExplosionRange(next);
			if(ret.canExplode){
				ranges.push(next);
				game.board[next.y][next.x].obj = 'explosion';
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

	if(game.board[next.y][next.x].obj == 'steel'){
		return ret;
	}

	if(game.board[next.y][next.x].obj == 'explosion'){
		return ret;
	}

	if(game.board[next.y][next.x].obj == 'block'){
		ret.canExplode = true;
		return ret;
	}

	ret.canExplode = true;
	ret.stop = false;

	return ret;

}

const player_actions = {
	ArrowUp : function(playerId){
		let player = game.players[playerId];			

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
		let player = game.players[playerId];			

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
		let player = game.players[playerId];			

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
		let player = game.players[playerId];			

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
		let player = game.players[playerId];

		if(checkBombs(playerId) >= player.max){
			return;
		}

		if(game.board[player.y][player.x].bomb){
			return;
		}

		//check if the spot can have a bomb
		if(game.board[player.y][player.x].obj != 'depoistrocaisso'){
			let bomb = {
				user : playerId,
				x : player.x,
				y : player.y,
				time : 3000,
				power : player.power
			}
			game.bombs.push(bomb);
			game.board[bomb.y][bomb.x].bomb = bomb;
		}
	}
}

export function makeAnAction(command){
	let action = player_actions[command.keyPressed];

	if(action){
		action(command.player);
	}
}

function checkBombs(playerId){
	let n_bombs = 0;

	for(let index in game.bombs){
		let bomb = game.bombs[index];
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
	if(game.board[destination.y][destination.x].obj == "steel"){
		return false;
	} 

	//block
	if(game.board[destination.y][destination.x].obj == "block"){
		return false;
	} 

	//bombs
	if(game.board[destination.y][destination.x].bomb){
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