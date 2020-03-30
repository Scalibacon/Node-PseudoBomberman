function ExplosionModel(state){
    this.state = state;
    this.itemModel = require('../../app/models/item')();
    this.blockModel = require('../../app/models/block')();   

    this.setState = function(state){
        this.state = state;
        this.itemModel.setState(state);
        //this.bombModel.setState(state);
        this.blockModel.setState(state);
    }

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
			if(this.state.board[explosion.ranges[i].y][explosion.ranges[i].x].obj === 'explosion')
				this.state.board[explosion.ranges[i].y][explosion.ranges[i].x].obj = 'empty';
		}	
    }
    
    this.calculateExplosionRange = function(explosion){
		let factorX = [1, -1, 0, 0];
		let factorY = [0, 0, 1, -1];

		let ranges = [];

		ranges.push(explosion.center);
		if(this.state.board[explosion.center.y][explosion.center.x].obj !== 'steel')
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
			this.blockModel.turnToAsh(next.x, next.y);
			return result;
		}

		result.canExplode = true;
		result.stop = false;

		return result;
    }
}

module.exports = function(state){
	return new ExplosionModel(state);
}