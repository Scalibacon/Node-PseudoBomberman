export const game = {
	board : [],

	board_size : {x: 600, y: 400},

	players : {
		scali : {x: 0, y: 0, speed: 1, status: 'idle', dir: 'right'}
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

export function makeAnAction(command){
	let action = player_actions[command.keyPressed];

	if(action){
		action(command.player);
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

		let walk = walkTo["right"];
		walk(player);
	},

	ArrowLeft : function(playerId){
		game.players[player].x--;
		console.log(game.players[player]);
	}
}

const walkTo = {
	"right" : function(player){
		player.dir = 'right';	

		if(player.x + 1 > 29){
			return;
		}

		updatePosition(player, function(){
			player.x++;
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