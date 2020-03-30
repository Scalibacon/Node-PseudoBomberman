function BlockModel(state){
	this.itemModel = require('../../app/models/item')();
	this.state = state;
	this.fallingSpot = {x: 0, y: 0};	

	this.setState = function(state){
		this.state = state;
		this.itemModel.setState(state);
	}

	this.turnToAsh = function(x, y){
		spot = this.state.board[y][x];

		spot.obj = "ash";

		let ash = {
			time : 750,
			x,
			y
		}

		this.state.ashes.push(ash);
	}

	this.ashTimer = function(time){
		for(let index in this.state.ashes){
			let ash = this.state.ashes[index];

			if(ash.time > 0){
				ash.time -= time;
			} else {
				this.removeAsh(ash)
			}
		}
	}

	this.removeAsh = function(ash){
		const index = this.state.ashes.indexOf(ash);
		this.state.ashes.splice(index, 1);

		this.state.board[ash.y][ash.x].obj = 'empty';

		this.itemModel.dropItem(ash.x, ash.y);
	}

	this.fallSteel = function(){
		let x = JSON.parse(JSON.stringify(this.fallingSpot.x));
		let y = JSON.parse(JSON.stringify(this.fallingSpot.y));
		
		this.fallingSpot.x++;		

		if(this.fallingSpot.x >= 17){
			this.fallingSpot.x = 0;
			this.fallingSpot.y++;
		}

		if(x >= 17 || y >= 11){
			return;
		}

		if(this.state.board[y][x].obj === 'steel'){
			return;
		}

		this.state.board[y][x].obj = 'steel';
	
		for(let playerId in this.state.players){
			let player = this.state.players[playerId];	

			if(player.y == y && player.x == x){
				player.status = 'dead';
			}
		}
	}
}

module.exports = function(state){
	return new BlockModel(state);
}





