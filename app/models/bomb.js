function BombModel(state){	
	this.explosionModel = require('../../app/models/explosion')();
	this.state = state;

	this.setState = function(state){
		this.state = state;		
		this.explosionModel.setState(state);
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

		if(this.state.board[player.y][player.x].bomb || this.state.board[player.y][player.x].obj !== 'empty'){
			return;
		}

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

	this.explode = function(bomb){
		this.removeBomb(bomb);

		var explosion = {
			power : bomb.power,
			center : {x : bomb.x, y : bomb.y},
			user : bomb.user,
			time : 750
		}

		explosion.ranges = this.explosionModel.calculateExplosionRange(explosion);
		this.state.explosions.push(explosion);
	}

	this.checkBombTouch = function(){
		for(let i in this.state.bombs){
			let bomb = this.state.bombs[i];	

			let slot = this.state.board[bomb.y][bomb.x];

			if(slot.obj == 'explosion' || slot.obj == 'steel'){
				this.explode(bomb);
			}
		}
	}
}

module.exports = function(state){
	return new BombModel(state);
}