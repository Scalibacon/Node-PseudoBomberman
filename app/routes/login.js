let access = require('../../app/controllers/access');

module.exports = function(app){
	app.post('/entrar', function(req, res){
		access.entrar(req, res);
	})
}