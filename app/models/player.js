module.exports.createPlayer = function(id, x, y){
	return {
		id : id,
		x: x, 
		y: y, 
		speed: 1, 
		max: 3, 
		power: 2, 
		status: 'idle', 
		dir: 'down'
	}
}