const express = require('express');

const access = require('../app/controllers/access');

const routes = express.Router();

routes.get('/game', access.game);
routes.get('/lobby', access.lobby);
routes.post('/entrar', access.entrar);

routes.get('/', function(req, res){
	res.render('index');
})

module.exports = routes;
