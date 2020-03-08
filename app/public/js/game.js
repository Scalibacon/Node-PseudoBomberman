export const game = {
	board : [],

	board_size : {x: 17, y: 11},

	players : {
		scali : {x: 0, y: 0, speed: 1, max: 3, power: 2, status: 'idle', dir: 'right'}
	},

	bombs : [],

	explosions : [],

	generateEmptyBoard : function(){
		this.board = initializeBiArray(this.board, 11);
		for(let i = 0; i < 11; i++){
			for(let j = 0; j < 17; j++){
				this.board[i][j] = 0;
			}
		}
	},

	generateDefaultBoard : function(){
		this.board = initializeBiArray(this.board, 11);
		for(let i = 0; i < 11; i++){
			for(let j = 0; j < 17; j++){
				if((j + 1) % 2 == 0 && (i + 1) % 2 == 0){
					this.board[i][j] = 1;
				} else {
					this.board[i][j] = 0;
				}
			}
		}
	},

	startBombTimer : function(){
		setInterval(bombTimer, 100);
	}
}

export function makeAnAction(command){
	let action = player_actions[command.keyPressed];

	if(action){
		action(command.player);
	}
}

function bombTimer(){
	for(let index in game.bombs){
		let bomb = game.bombs[index];

		if(bomb.time > 0){
			bomb.time -= 100;
		} else {
			explode(index);
		}
	}
}

function explode(index){
	console .log("nuke");
	var bomb = game.bombs[index];

	game.bombs.splice(index, 1);

	var explosion = {
		power : bomb.power,
		center : {x : bomb.x, y : bomb.y},
		user : bomb.user,
		time : 0
	}

	explosion.ranges = calculateExplosionRange(explosion);
	game.explosions.push(explosion);
	console.log(explosion);
}

function calculateExplosionRange(explosion){
	let ranges = [];
	ranges.push(explosion.center);

	//right
	for(let i = 1; i <= explosion.power; i++){
		let next = {x: explosion.center.x + i, y: explosion.center.y};
		if(checkExplosionRange(next)){
			ranges.push(next);
		} else {
			break;
		}
	}
	//left
	for(let i = 1; i <= explosion.power; i++){
		let next = {x: explosion.center.x - i, y: explosion.center.y};
		if(checkExplosionRange(next)){
			ranges.push(next);
		} else {
			break;
		}
	}
	//down
	for(let i = 1; i <= explosion.power; i++){
		let next = {x: explosion.center.x, y: explosion.center.y + i};
		if(checkExplosionRange(next)){
			ranges.push(next);
		} else {
			break;
		}
	}
	//up
	for(let i = 1; i <= explosion.power; i++){
		let next = {x: explosion.center.x, y: explosion.center.y - i};
		if(checkExplosionRange(next)){
			ranges.push(next);
		} else {
			break;
		}
	}

	return ranges;
}

function checkExplosionRange(next){
	if(next.x < 0 || next.x >= 17 || next.y < 0 || next.y >= 11){
		return false;
	}

	if(game.board[next.y][next.x] == 1){
		return false;
	}

	return true;

}

function initializeBiArray(arr, lines){
	for(let i = 0; i < lines; i++){
		arr[i] = [];
	}
	return arr;
}

const player_actions = {
	ArrowUp : function(playerId){
		let player = game.players[playerId];			

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
		let player = game.players[playerId];			

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
		let player = game.players[playerId];			

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
		let player = game.players[playerId];			

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
		let player = game.players[playerId];

		if(checkBombs(playerId) >= player.max){
			return;
		}

		//check if the spot can have a bomb
		if(game.board[player.y][player.x] == 0){
			let date = new Date();
			let time = date.getTime();
			let bomb = {
				user : playerId,
				x : player.x,
				y : player.y,
				time : 3000,
				power : player.power
			}
			game.bombs.push(bomb);
		}
	}
}

function checkBombs(playerId){
	let n_bombs = 0;

	for(let index in game.bombs){
		let bomb = game.bombs[index];
		if(bomb.user == playerId){
			n_bombs++;
		}
	}

	return n_bombs;
}

function checkDestination(destination){
	//border
	if(destination.x < 0 || destination.x >= 17 || destination.y < 0 || destination.y >= 11){
		return false;
	}

	//obsidian
	if(game.board[destination.y][destination.x] == 1){
		return false;
	} 

	//bombs
	for(let index in game.bombs){
		let bomb = game.bombs[index];
		if(bomb.x == destination.x && bomb.y == destination.y){
			return false;
		}
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
			player.status = "idle"; 
		}, delay);
	}, delay);
}