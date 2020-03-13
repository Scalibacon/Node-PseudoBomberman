let createBoard = require('../../app/models/board');
let playerModel = require('../../app/models/player');
let bombModel = require('../../app/models/bomb');

module.exports.createGame = function(){
	return game;
}

let game = {
	state : {
		board_size : {x: 17, y: 11},
		board : [],
		players : {},
		bombs : [],
		explosions : [],
		itens : [],
	},

	io : null,

	startGame : function(){
		playerModel.setState(this.state);
		bombModel.setState(this.state);

		this.state.board = createBoard();

		let time = 50;
		setInterval(function(){
			updateGame(time);
		}, time);		
	},

	addPlayer : function(socketId){
		let x, y;
		switch(Object.keys(this.state.players).length){
			case 0:
				x = 0;
				y = 0;
				break;
			case 1: 
				x = 16;
				y = 0;
				break;
			case 2:
				x = 0;
				y = 10;
				break;
			case 3:
				x = 16;
				y = 10;
				break;
			default:
				x = 0;
				y = 0;
		}

		let player = playerModel.createPlayer(socketId, x, y);

		this.state.players[socketId] = player;
	},

	setIo : function(io){
		this.io = io;
	},

	makeAnAction : function(command){
		let action = player_actions[command.keyPressed];

		if(action){
			action(command.player);
		}
	}
}

function updateGame(time){	
	bombModel.bombTimer(time);
	bombModel.checkExplosionHit();
	playerModel.checkPlayerTouch();
	bombModel.explosionTimer(time);

	updateClientState(game.state);	
}

function updateClientState(state){
	game.io.emit('updateState', state);
}

const player_actions = {
	ArrowUp : function(playerId){
		let player = game.state.players[playerId];			

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
		let player = game.state.players[playerId];			

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
		let player = game.state.players[playerId];			

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
		let player = game.state.players[playerId];			

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
		let player = game.state.players[playerId];

		bombModel.addBomb(player);		
	}
}

function checkDestination(destination){
	//border
	if(destination.x < 0 || destination.x >= 17 || destination.y < 0 || destination.y >= 11){
		return false;
	}

	//steel
	if(game.state.board[destination.y][destination.x].obj == "steel"){
		return false;
	} 

	//block
	if(game.state.board[destination.y][destination.x].obj == "block"){
		return false;
	} 

	//bombs
	if(game.state.board[destination.y][destination.x].bomb){
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
