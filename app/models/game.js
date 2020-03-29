module.exports.createGame = function(){
	return new GameModel();
}

function GameModel(){
	this.createBoard = require('../../app/models/board');
	this.playerModel = require('../../app/models/player')();
	this.bombModel = require('../../app/models/bomb')();
	this.explosionModel = require('../../app/models/explosion')();
	this.blockModel = require('../../app/models/block')();
	this.itemModel = require('../../app/models/item')();
	this.skillModel = require('../../app/models/skill')();
	this.loop = null;

	this.state = {
		board_size : {x: 17, y: 11},
		board : [],
		players : {},
		bombs : [],
		explosions : [],
		ashes : [],
		itens : [],
		time : 0,
		status : 'running'
	}

	this.room = null;

	this.io = null;

	this.startGame = function(room){
		this.playerModel.setState(this.state);
		this.bombModel.setState(this.state);
		this.explosionModel.setState(this.state);
		this.blockModel.setState(this.state);
		this.itemModel.setState(this.state);
		this.skillModel.setState(this.state);

		this.state.status = 'running';

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
		if(this.state.status === 'finished'){
			return;
		}

		let player = this.state.players[command.player.id];
		if(player == null || player == undefined){
			return;
		}	

		if(this.playerModel[command.keyPressed]){
			this.playerModel[command.keyPressed](player);
		}
	}

	this.checkPlayersAlive = function(){
		let playersAlive = 0;

		for(let playerId in this.state.players){
			let player = this.state.players[playerId];	

			if(player.status !== 'dead'){
				playersAlive++;
			}
		}

		if( (Object.keys(this.state.players).length === 1 && playersAlive === 0) ||
			(Object.keys(this.state.players).length > 1 && playersAlive <= 1) ){
			if(this.state.status !== 'finished'){
				this.finishGame();
			}
		}
	}

	this.finishGame = function(){
		//depois emitir pros sockets
		this.state.status = 'finished';		

		setTimeout(() => {
			clearInterval(this.loop);
			this.resetGame();						
			this.startGame(this.room);
		}, 3000);
	}

	this.resetGame = function(){
		this.state.board = [];
		this.state.bombs = [];
		this.state.explosion = [];
		this.state.ashes = [];
		this.state.itens = [];
		this.state.time = 0;

		for(let i in this.state.players){
			let player = this.state.players[i];
			player.speed = 1;
			player.max_bombs = 1;
			player.power = 1; 
			player.status = 'idle';
			player.dir = 'down';
			player.y = player.skill.spot[0];
			player.x = player.skill.spot[1];

			this.skillModel.setSkill(player, player.skill.id);
		}
	}

	this.updateGame = function(time){	
		this.state.time += time;
		this.bombModel.bombTimer(time);
		this.bombModel.checkBombTouch(time);
		this.itemModel.checkItemTouch(time);
		this.playerModel.checkPlayerTouch();
		this.explosionModel.explosionTimer(time);
		this.blockModel.ashTimer(time);
		this.skillModel.updatePlayersSkills(time);		

		this.updateClientState(this.state);	

		this.checkPlayersAlive();
	}

	this.updateClientState = function(state){
		this.io.to(this.room).emit('updateState', state);
	}
}