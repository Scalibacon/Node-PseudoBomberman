module.exports.getSocket = function(server){

	let io = require('socket.io').listen(server);

	io.on('connection', function(socket){

		console.log("Alguém connectou");
		console.log(socket);

	})

	return io;
}