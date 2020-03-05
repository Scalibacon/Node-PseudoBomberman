export const game = {
	board : [],

	board_size : {x: 620, y: 420},

	players : {
		scali : {x: 0, y: 0, speed: 2, status: 'idle', dir: 'right'}
	},

	generateEmptyBoard : function(){
		this.board = initializeBiArray(this.board, 41);
		for(let i = 0; i < 41; i++){
			for(let j = 0; j < 61; j++){
				this.board[i][j] = 0;
			}
		}
	},

	generateDefaultBoard : function(){
		this.board = initializeBiArray(this.board, 41);
		for(let i = 0; i < 41; i++){
			for(let j = 0; j < 61; j++){
				if((j + 1) % 2 == 0 && (i + 1) % 2 == 0){
					this.board[i][j] = 1;
				} else {
					this.board[i][j] = 0;
				}
			}
		}
	}
}

function initializeBiArray(arr, lines){
	for(let i = 0; i < lines; i++){
		arr[i] = [];
	}
	return arr;
}

export function makeAnAction(command){
	let action = player_actions[command.keyPressed];

	if(action){
		action(command.player);
	}
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
	}
}

function checkDestination(destination){
	//border
	if(destination.x < 0 || destination.x > 30 || destination.y < 0 || destination.y > 20){
		return false;
	}

	//obsidian
	if(game.board[destination.y][destination.x] == 1){
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
			player.status = "idle"; 
		}, delay);
	}, delay);
}