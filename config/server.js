var express = require('express')
var consign = require('consign')
var app = express();

app.use(express.static('./app/public'))

app.set('views', './app/views')
app.set('view engine', 'ejs')

consign()
	.include('app/routes')
	.into(app)

module.exports = app;