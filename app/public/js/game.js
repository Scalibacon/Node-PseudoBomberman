export const game = {
	board : [],

	board_size : {x: 620, y: 420},

	players : {
		scali : {x: 0, y: 0, speed: 5, status: 'idle', dir: 'right'}
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

		if(player.y - 1 < 0){
			return;
		}

		updatePosition(player, function(){
			player.y--;
		});
	},

	ArrowDown : function(playerId){
		let player = game.players[playerId];			

		player.dir = 'down';	

		if(player.y + 1 > 20){
			return;
		}

		updatePosition(player, function(){
			player.y++;
		});
	},

	ArrowRight : function(playerId){
		let player = game.players[playerId];			

		player.dir = 'right';	

		if(player.x + 1 > 30){
			return;
		}

		updatePosition(player, function(){
			player.x++;
		});
	},

	ArrowLeft : function(playerId){
		let player = game.players[playerId];			

		player.dir = 'left';	

		if(player.x - 1 < 0){
			return;
		}

		updatePosition(player, function(){
			player.x--;
		});
	}
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