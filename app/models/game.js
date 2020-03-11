let createBoard = require('../../app/models/board');

module.exports.createGame = function(){
	return game;
}

let game = {
	board : [],

	players : [],

	bombs : [],

	explosion : [],

	itens : [],

	startGameUpdate : function(){
		//teste
		this.board = createBoard();

		/*
		let time = 100;
		setInterval(function(){
			updateGame(time);
		}, time);
		*/
	}
}

/*
function updateGame(time){
	bombTimer(time);
	checkExplosionHit();
	checkPlayerTouch();
	explosionTimer(time);	
}
*/