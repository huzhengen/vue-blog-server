var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var boot = require('./routes/boot');
var blogs = require('./routes/blogs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({ secret: 'hello world', cookie: { maxAge: 6000000 } }));

let allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', req.headers.origin)
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH')
	res.header('Access-Control-Allow-Headers', 'Content-Type')
	res.header("Access-Control-Allow-Credentials", true)
	if (req.method === "OPTIONS") {
		res.send(200)
	} else {
		next()
	}
}
app.use(allowCrossDomain)

app.use('/', routes);
app.use('/users', users);
app.use('/boot', boot);
app.use('/blogs', blogs);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
// no stacktraces leaked to user unless in development environment
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: (app.get('env') === 'development') ? err : {}
  });
});


module.exports = app;
