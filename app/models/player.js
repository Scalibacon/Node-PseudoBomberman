let bombModel = require('../../app/models/bomb');

let state = {};

module.exports.createPlayer = function(id, x, y){
	return {
		id : id,
		x: x, 
		y: y, 
		speed: 5, 
		max: 3, 
		power: 4, 
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

module.exports.player_actions = {
	ArrowUp : function(player){
		player.dir = 'up';	

		walk(player);
	},

	ArrowDown : function(player){
		player.dir = 'down';

		walk(player);
	},

	ArrowRight : function(player){
		player.dir = 'right';	

		walk(player);
	},

	ArrowLeft : function(player){
		player.dir = 'left';

		walk(player);
	},

	" " : function(player){	
		bombModel.addBomb(player);		
	}
}

function walk(player){
	let destination = {x: player.x, y: player.y};

	switch(player.dir){
		case 'right':
			destination.x++;
			break;
		case 'left':
			destination.x--;
			break;
		case 'up':
			destination.y--;
			break;
		case 'down':
			destination.y++;
			break;
	}

	if(checkDestination(destination)){
		updatePosition(player, destination);
	}
}

function checkDestination(destination){
	//border
	if(destination.x < 0 || destination.x >= 17 || destination.y < 0 || destination.y >= 11){
		return false;
	}
	//steel
	if(state.board[destination.y][destination.x].obj == "steel"){
		return false;
	} 
	//block
	if(state.board[destination.y][destination.x].obj == "block"){
		return false;
	} 
	//bombs
	if(state.board[destination.y][destination.x].bomb){
		return false;
	} 

	return true;
}

function updatePosition(player, destination){
	if(player.status != "idle"){
		return;
	}

	player.status = "walking";

	var delay = 200 / player.speed;

	setTimeout(function(){
		player.x = destination.x;
		player.y = destination.y;
		setTimeout(function(){
			if(player.status != "burning"){
				player.status = "idle"; 
			}
		}, delay);
	}, delay);
}