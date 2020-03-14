let itemModel = require('../../app/models/item')();

function BlockModel(state){
	this.state = state;

	this.setState = function(state){
		this.state = state;
		itemModel.setState(state);
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

		itemModel.dropItem(ash.x, ash.y);
	}
}

module.exports = function(state){
	return new BlockModel(state);
}





