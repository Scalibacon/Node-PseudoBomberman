function ItemModel(state){
	this.state = state;

	this.setState = function(state){
		this.state = state;
	}

	this.dropItem = function(x, y){
		let chance = Math.floor(Math.random() * 100);

		if(chance > 50){
			let item = {
				type : 'speed',
				x,
				y,
			}

			this.state.itens.push(item);
			this.state.board[y][x].obj = 'item'
		}
	}
}

module.exports = function(state){
	return new ItemModel(state);
}