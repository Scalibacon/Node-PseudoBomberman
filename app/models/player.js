let state = {};

module.exports.createPlayer = function(id, x, y){
	return {
		id : id,
		x: x, 
		y: y, 
		speed: 1, 
		max: 1, 
		power: 1, 
		status: 'idle', 
		dir: 'down'
	}
}

module.exports.setState = function(stt){
	state = stt;
}

module.exports.checkPlayerTouch = function(){
	for(let playerId in state.players){
		let player = state.players[playerId];	

		let board_slot = state.board[player.y][player.x];

		if(board_slot.obj == 'explosion'){
			if(player.status != "burning"){
				player.status = "burning";
				console.log(`${playerId} was burned :O`);
			}
		}
	}
}