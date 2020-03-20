var app = require("./config/server");
var socket = require("./app/controllers/socket");

let server = app.listen(80, function(){
	console.log('Server ON na porta 80')
});

let io = socket.getSocket(server);