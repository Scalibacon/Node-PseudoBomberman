let access = require('../../app/controllers/access');

module.exports = function(app){
	app.get('/lobby', function(req, res){
		access.lobby(req, res);
	})
}