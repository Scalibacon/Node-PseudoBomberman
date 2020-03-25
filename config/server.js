const express = require('express')
const expressSession = require('express-session');
const routes = require('./routes');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('./app/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());

app.use(expressSession({
	secret : "bombgameanythingass",
	resave : false,
	saveUninitialized : false
}));

app.use(function(req, res, next) {
 	res.locals.session = req.session;
	next();
});

app.set('views', './app/views');
app.set('view engine', 'ejs');

app.use(routes);

module.exports = app;