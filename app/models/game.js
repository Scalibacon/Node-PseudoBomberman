module.exports.createGame = function(){
	return new GameModel();
}

function GameModel(){
	this.createBoard = require('../../app/models/board');
	this.playerModel = require('../../app/models/player')();
	this.bombModel = require('../../app/models/bomb')();
	this.blockModel = require('../../app/models/block')();
	this.loop = null;

	this.state = {
		board_size : {x: 17, y: 11},
		board : [],
		players : {},
		bombs : [],
		explosions : [],
		ashes : [],
		itens : [],
		time : 0
	}

	this.room = null;

	this.io = null;

	this.startGame = function(room){
		this.playerModel.setState(this.state);
		this.bombModel.setState(this.state);
		this.blockModel.setState(this.state);

		this.room = room;

		this.state.board = this.createBoard();

		let time = 50;
		(function(game){
			game.loop = setInterval(function(){
				game.updateGame(time);
			}, time);
		})(this)		
	}

	this.addPlayer = function(player){
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

		let game_player = this.playerModel.createPlayer(player, x, y);

		this.state.players[player.id] = game_player;
	}

	this.removePlayer = function(id){
		delete this.state.players[id];
		if(Object.keys(this.state.players).length <= 0){
			clearInterval(this.loop);
		}
	}

	this.setIo = function(io){
		this.io = io;
	}

	this.makeAnAction = function(command){
		let player = this.state.players[command.player.id];
		if(player == null || player == undefined){
			return;
		}	

		if(this.playerModel[command.keyPressed]){
			this.playerModel[command.keyPressed](player);
		}
	}

	this.updateGame = function(time){	
		this.state.time += time;
		this.bombModel.bombTimer(time);
		this.bombModel.checkExplosionHit();
		this.playerModel.checkPlayerTouch();
		this.bombModel.explosionTimer(time);
		this.blockModel.ashTimer(time);

		this.updateClientState(this.state);	
	}

	this.updateClientState = function(state){
		this.io.to(this.room).emit('updateState', state);
	}
}