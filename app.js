var app = require("./config/server")

let server = app.listen(80, function(){
	console.log('Server ON na porta 80')
});

let io = app.app.controllers.gameSocket.getSocket(server);

app.set("io", io);