let item_types = [
	'speed',
	'max_bombs',
	'power'
]

function ItemModel(state){
	this.state = state;

	this.setState = function(state){
		this.state = state;
	}

	this.dropItem = function(x, y){
		let chance = Math.floor(Math.random() * 100);

		if(chance > 50){
			let item = {
				type : randomItem(),
				x,
				y,
			}

			this.state.itens.push(item);
			this.state.board[y][x].item = item;
		}
	}

	this.removeItem = function(item){
		const index = this.state.itens.indexOf(item);
		this.state.board[item.y][item.x].item = null;
		this.state.itens.splice(index, 1);	
	}

	this.checkItemTouch = function(){
		for(let i in this.state.itens){
			let item = this.state.itens[i];	

			let slot = this.state.board[item.y][item.x];

			if(slot.obj == 'explosion'){
				this.removeItem(item);
			}
		}		
	}
}

function randomItem(){
	let random_index = Math.floor(Math.random() * item_types.length);

	return item_types[random_index];
}

module.exports = function(state){
	return new ItemModel(state);
}