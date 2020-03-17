module.exports.entrar = function(req, res){
	let name = req.body.name;
	if(name == ""){
		res.render('index', {erro : 'empty'});
		return;
	}

	req.session.name = name;
	res.redirect('lobby');
}

module.exports.game = function(req, res){
	let name = req.session.name;
	if(name === undefined || name === ''){
		res.redirect('/');
		return;
	}

	res.render('game');
}

module.exports.lobby = function(req, res){
	let name = req.session.name;
	if(name === undefined || name === ''){
		res.redirect('/');
		return;
	}

	res.render('lobby');
}