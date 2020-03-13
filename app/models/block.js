let itemModel = require('../../app/models/item');
let state = {};

module.exports.setState = function(stt){
	state = stt;
	itemModel.setState(state);
}

module.exports.turnToAsh = function(x, y){
	spot = state.board[y][x];

	spot.obj = "ashe";

	let ash = {
		time : 750,
		x,
		y
	}

	state.ashes.push(ash);
}

module.exports.ashTimer = function(time){
	for(let index in state.ashes){
		let ash = state.ashes[index];

		if(ash.time > 0){
			ash.time -= time;
		} else {
			removeAsh(ash)
		}
	}
}

function removeAsh(ash){
	const index = state.ashes.indexOf(ash);
	state.ashes.splice(index, 1);

	state.board[ash.y][ash.x].obj = 'empty';

	itemModel.dropItem(ash.x, ash.y);
}