export const game = {
	board : [],

	board_size : {x: 600, y: 400},

	players : {
		scali : {x: 0, y:0}
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
	ArrowUp : function(player){
		game.players[player].y--;
		console.log(game.players[player]);
	},

	ArrowDown : function(player){
		game.players[player].y++;
		console.log(game.players[player]);
	},

	ArrowRight : function(player){
		game.players[player].x++;
		console.log(game.players[player]);
	},

	ArrowLeft : function(player){
		game.players[player].x--;
		console.log(game.players[player]);
	}
}

export function makeAnAction(command){
	let action = player_actions[command.keyPressed];

	if(action){
		action(command.player);
	}
}

//export {game};