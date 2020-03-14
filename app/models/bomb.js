let blockModel = require('../../app/models/block')();
let itemModel = require('../../app/models/item')();

let state = {};

function BombModel(state){
	this.state = state;

	this.setState = function(state){
		this.state = state;
		blockModel.setState(state);
		itemModel.setState(state);
	}

	this.bombTimer = function(time){
		for(let index in this.state.bombs){
			let bomb = this.state.bombs[index];

			if(bomb.time > 0){
				bomb.time -= time;
			} else {
				this.explode(bomb);
			}
		}
	}

	this.addBomb = function(player){
		if(this.checkBombs(player.id) >= player.max_bombs){
			return;
		}

		if(this.state.board[player.y][player.x].bomb){
			return;
		}

		//check if the spot can have a bomb
		if(this.state.board[player.y][player.x].obj != 'depoistrocaisso'){
			let bomb = {
				user : player.id,
				x : player.x,
				y : player.y,
				time : 3000,
				power : player.power
			}
			this.state.bombs.push(bomb);
			this.state.board[bomb.y][bomb.x].bomb = bomb;
		}
	}

	this.checkBombs = function(playerId){
		let n_bombs = 0;

		for(let index in this.state.bombs){
			let bomb = this.state.bombs[index];
			if(bomb.user == playerId){
				n_bombs++;
			}
		}

		return n_bombs;
	}

	this.removeBomb = function(bomb){
		const index = this.state.bombs.indexOf(bomb);
		this.state.board[bomb.y][bomb.x].bomb = null;
		this.state.bombs.splice(index, 1);
	}

	/********************** EXPLOSION **********************/

	this.explosionTimer = function(time){
		for(let index in this.state.explosions){
			let explosion = this.state.explosions[index];

			if(explosion.time > 0){
				explosion.time -= time;
			} else {
				this.removeExplosion(explosion);
			}
		}
	}

	this.removeExplosion = function(explosion){
		const index = this.state.explosions.indexOf(explosion);
		this.state.explosions.splice(index, 1);

		for(let i = 0; i < explosion.ranges.length; i++){
			this.state.board[explosion.ranges[i].y][explosion.ranges[i].x].obj = 'empty';
		}	
	}

	this.explode = function(bomb){
		this.removeBomb(bomb);

		var explosion = {
			power : bomb.power,
			center : {x : bomb.x, y : bomb.y},
			user : bomb.user,
			time : 750
		}

		explosion.ranges = this.calculateExplosionRange(explosion);
		this.state.explosions.push(explosion);
	}

	this.calculateExplosionRange = function(explosion){
		let factorX = [1, -1, 0, 0];
		let factorY = [0, 0, 1, -1];

		let ranges = [];

		ranges.push(explosion.center);
		this.state.board[explosion.center.y][explosion.center.x].obj = 'explosion';

		for(let factor = 0; factor < 4; factor++){
			for(let i = 1; i <= explosion.power; i++){
				let next = {x: explosion.center.x + (i * factorX[factor]), y: explosion.center.y + (i * factorY[factor])};
				let ret = this.checkExplosionRange(next);
				if(ret.canExplode){
					ranges.push(next);
					this.state.board[next.y][next.x].obj = 'explosion';
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

	this.checkExplosionRange = function(next){
		var result = {
			canExplode : false, 
			stop : true
		};

		if(next.x < 0 || next.x >= 17 || next.y < 0 || next.y >= 11){
			return result;
		}

		if(this.state.board[next.y][next.x].bomb){
			result.canExplode = true;
			return result;
		}

		if(this.state.board[next.y][next.x].obj == 'steel'){
			return result;
		}

		if(this.state.board[next.y][next.x].obj == 'explosion'){
			result.stop = false;
			return result;
		}

		if(this.state.board[next.y][next.x].obj == 'block'){
			blockModel.turnToAsh(next.x, next.y);
			return result;
		}

		result.canExplode = true;
		result.stop = false;

		return result;
	}

	this.checkExplosionHit = function(){
		for(let index in this.state.explosions){
			let explosion = this.state.explosions[index];

			for(let range_index in explosion.ranges){
				let range = explosion.ranges[range_index];

				let slot = this.state.board[range.y][range.x];

				if(slot.bomb){
					this.explode(slot.bomb);
				}

				if(slot.item){
					itemModel.removeItem(slot.item);
				}
			}
		}
	}
}

module.exports = function(state){
	return new BombModel(state);
}