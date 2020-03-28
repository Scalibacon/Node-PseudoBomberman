const arrays = require('../utils/arrays');

module.exports = function(){
	return generateDefaultBoard();
}

function generateDefaultBoard(){
	let board = [];
	board = arrays.initializeBiArray(board, 11);
	for(let i = 0; i < 11; i++){
		for(let j = 0; j < 17; j++){
			board[i][j] = {
				obj : 'empty',
				bomb : null
			}

			if((j + 1) % 2 == 0 && (i + 1) % 2 == 0){
				board[i][j].obj = 'steel';
			}
		}
	}

	board = generateRandomBlocks(board);
	board = generateGrass(board);

	return board;
}

function generateRandomBlocks(board){
	for(let i = 0; i < 11; i++){
		for(let j = 0; j < 17; j++){

			if(board[i][j].obj == "steel"){
				continue;
			} else

			if(i == 0){
				if(j == 0 || j == 1 || j == 15 || j == 16){
					continue;
				}
			} else

			if(i == 1){
				if(j == 0 || j == 16){
					continue;
				}
			} else

			if(i == 9){
				if(j == 0 || j == 16){
					continue;
				}
			} else

			if(i == 10){
				if(j == 0 || j == 1 || j == 15 || j == 16){
					continue;
				}
			}			

			let random = Math.floor(Math.random() * 100);
			if(random >= 50){
				board[i][j].obj = "block";
			}
		}
	}

	return board;
}

function generateGrass(board){
	for(let i = 0; i < 11; i++){
		for(let j = 0; j < 17; j++){
			if(i >= 2 && i <= 9 && j >= 6 && j <= 10){
				board[i][j].grass = true;
			}
		}
	}
	return board;
}