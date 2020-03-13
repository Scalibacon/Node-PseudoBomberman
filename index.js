var app = require("./config/server");
var gameSocket = require("./app/controllers/gameSocket");

let server = app.listen(80, function(){
	console.log('Server ON na porta 80')
});

let io = gameSocket.getSocket(server);