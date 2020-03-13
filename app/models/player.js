let state = {};

module.exports.callPlayerModel = function(state){

}

module.exports.createPlayer = function(id, x, y){
	return {
		id : id,
		x: x, 
		y: y, 
		speed: 1, 
		max: 1, 
		power: 1, 
		status: 'idle', 
		dir: 'down'
	}
}

module.exports.player