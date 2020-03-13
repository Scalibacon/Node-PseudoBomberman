let state = {};

module.exports.setState = function(stt){
	state = stt;
}

module.exports.dropItem = function(x, y){
	let chance = Math.floor(Math.random() * 100);

	if(chance > 50){
		let item = {
			type : 'speed',
			x,
			y,
		}

		state.itens.push(item);
		state.board[y][x].obj = 'item'
	}
}