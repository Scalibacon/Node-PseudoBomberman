var express = require('express')
var consign = require('consign')
var bodyParser = require('body-parser');
var expressSession = require('express-session');

var app = express();

app.use(express.static('./app/public'))

app.set('views', './app/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({extended: true}))

app.use(expressSession({
	secret : "bombgameanythingass",
	resave : false,
	saveUninitialized : false
}));

app.use(function(req, res, next) {
 	res.locals.session = req.session;
	next();
});

consign()
	.include('app/routes')
	.into(app)

module.exports = app;