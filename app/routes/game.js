let access = require('../../app/controllers/access');

module.exports = function(app){
	app.get('/game', function(req, res){
		access.game(req, res);
	})
}