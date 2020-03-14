let bombModel = require('../../app/models/bomb')();
let itemModel = require('../../app/models/item')();

function PlayerModel(state){
	this.state = state;

	this.setState = function(state){
		this.state = state;
		bombModel.setState(state);
		itemModel.setState(state);
	}

	this.createPlayer = function(id, x, y){
		return {
			id : id,
			x: x, 
			y: y, 
			speed: 1, 
			max_bombs: 1, 
			power: 1, 
			status: 'idle', 
			dir: 'down'
		}
	}

	this.checkPlayerTouch = function(){
		for(let playerId in this.state.players){
			let player = this.state.players[playerId];	

			let slot = this.state.board[player.y][player.x];

			if(slot.obj == 'explosion'){
				if(player.status != "burning"){
					player.status = "burning";
					console.log(`${playerId} was burned :O`);
				}
			}

			if(slot.item){
				this.buff(player, slot.item.type);
				itemModel.removeItem(slot.item);
			}
		}
	}

	this.buff = function(player, type){
		if(player[type] < 7){
			player[type]++;
		}
	}

	this.w = function(player){
		player.dir = 'up';	

		this.walk(player);
	}

	this.s = function(player){
		player.dir = 'down';

		this.walk(player);
	}

	this.d = function(player){
		player.dir = 'right';	

		this.walk(player);
	}

	this.a = function(player){
		player.dir = 'left';

		this.walk(player);
	}

	this.e = function(player){	
		bombModel.addBomb(player);		
	}	

	this.walk = function(player){
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

		if(this.checkDestination(destination)){
			this.updatePosition(player, destination);
		}
	}

	this.checkDestination = function(destination){
		//border
		if(destination.x < 0 || destination.x >= 17 || destination.y < 0 || destination.y >= 11){
			return false;
		}
		//steel
		if(this.state.board[destination.y][destination.x].obj == "steel"){
			return false;
		} 
		//block
		if(this.state.board[destination.y][destination.x].obj == "block"){
			return false;
		} 
		//ash
		if(this.state.board[destination.y][destination.x].obj == "ash"){
			return false;
		} 
		//bombs
		if(this.state.board[destination.y][destination.x].bomb){
			return false;
		} 

		return true;
	}

	this.updatePosition = function(player, destination){
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
}

module.exports = function(state){
	return new PlayerModel(state);
}