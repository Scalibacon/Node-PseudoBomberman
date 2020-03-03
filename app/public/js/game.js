export const game = {
	board : [],

	board_size : {x: 600, y: 400},

	players : {
		scali : {x: 0, y: 0, speed: 1, status: 'idle'}
	},

	generateEmptyBoard : function(){
		for(let i = 0; i < 40; i++){
			for(let j = 0; j < 60; j++){
				this.board[j] = [];
				this.board[j][i] = 0;
			}
		}
	}
}

const player_actions = {
	ArrowUp : function(playerId){
		game.players[player].y--;
		console.log(game.players[player]);
	},

	ArrowDown : function(playerId){
		game.players[player].y++;
		console.log(game.players[player]);
	},

	ArrowRight : function(playerId){
		let player = game.players[playerId];		

		updatePosition(player, function(){
			game.players[playerId].x++;
		});
	},

	ArrowLeft : function(playerId){
		game.players[player].x--;
		console.log(game.players[player]);
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
		player.status = "idle";
	}, delay);
}

export function makeAnAction(command){
	let action = player_actions[command.keyPressed];

	if(action){
		action(command.player);
	}
}

//export {game};