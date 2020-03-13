let state = {};

module.exports.setState = function(stt){
	state = stt;
}

module.exports.bombTimer = function(time){
	for(let index in state.bombs){
		let bomb = state.bombs[index];

		if(bomb.time > 0){
			bomb.time -= time;
		} else {
			explode(bomb);
		}
	}
}

module.exports.addBomb = function(player){
	if(checkBombs(player.id) >= player.max){
			return;
	}

	if(state.board[player.y][player.x].bomb){
		return;
	}

	//check if the spot can have a bomb
	if(state.board[player.y][player.x].obj != 'depoistrocaisso'){
		let bomb = {
			user : player.id,
			x : player.x,
			y : player.y,
			time : 3000,
			power : player.power
		}
		state.bombs.push(bomb);
		state.board[bomb.y][bomb.x].bomb = bomb;
	}
}

function checkBombs(playerId){
	let n_bombs = 0;

	for(let index in state.bombs){
		let bomb = state.bombs[index];
		if(bomb.user == playerId){
			n_bombs++;
		}
	}

	return n_bombs;
}

function removeBomb(bomb){
	const index = state.bombs.indexOf(bomb);
	state.board[bomb.y][bomb.x].bomb = null;
	state.bombs.splice(index, 1);
}

/********************** EXPLOSION **********************/

module.exports.explosionTimer = function(time){
	for(let index in state.explosions){
		let explosion = state.explosions[index];

		if(explosion.time > 0){
			explosion.time -= time;
		} else {
			removeExplosion(explosion);
		}
	}
}

function removeExplosion(explosion){
	const index = state.explosions.indexOf(explosion);
	state.explosions.splice(index, 1);

	for(let i = 0; i < explosion.ranges.length; i++){
		state.board[explosion.ranges[i].y][explosion.ranges[i].x].obj = 'empty';
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
	state.explosions.push(explosion);
}

function calculateExplosionRange(explosion){
	let factorX = [1, -1, 0, 0];
	let factorY = [0, 0, 1, -1];

	let ranges = [];

	ranges.push(explosion.center);
	state.board[explosion.center.y][explosion.center.x].obj = 'explosion';

	for(let factor = 0; factor < 4; factor++){
		for(let i = 1; i <= explosion.power; i++){
			let next = {x: explosion.center.x + (i * factorX[factor]), y: explosion.center.y + (i * factorY[factor])};
			let ret = checkExplosionRange(next);
			if(ret.canExplode){
				ranges.push(next);
				state.board[next.y][next.x].obj = 'explosion';
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

	if(state.board[next.y][next.x].obj == 'steel'){
		return ret;
	}

	if(state.board[next.y][next.x].obj == 'explosion'){
		ret.stop = false;
		return ret;
	}

	if(state.board[next.y][next.x].obj == 'block'){
		ret.canExplode = true;
		return ret;
	}

	ret.canExplode = true;
	ret.stop = false;

	return ret;
}

module.exports.checkExplosionHit = function(){
	for(let index in state.explosions){
		let explosion = state.explosions[index];

		for(let range_index in explosion.ranges){
			let range = explosion.ranges[range_index];

			let board_slot = state.board[range.y][range.x];

			if(board_slot.bomb){
				explode(board_slot.bomb);
			}
		}
	}
}