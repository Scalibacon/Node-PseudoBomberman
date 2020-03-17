let createBoard = require('../../app/models/board');
let playerModel = require('../../app/models/player')();
let bombModel = require('../../app/models/bomb')();
let blockModel = require('../../app/models/block')();

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
		ashes : [],
		itens : [],
		time : 0
	},

	io : null,

	startGame : function(){
		playerModel.setState(this.state);
		bombModel.setState(this.state);
		blockModel.setState(this.state);

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
		let player = this.state.players[command.player];
		if(player == null || player == undefined){
			return;
		}	

		if(playerModel[command.keyPressed]){
			playerModel[command.keyPressed](player);
		}
	}
}

function updateGame(time){	
	game.state.time += time;
	bombModel.bombTimer(time);
	bombModel.checkExplosionHit();
	playerModel.checkPlayerTouch();
	bombModel.explosionTimer(time);
	blockModel.ashTimer(time);

	updateClientState(game.state);	
}

function updateClientState(state){
	game.io.emit('updateState', state);
}
