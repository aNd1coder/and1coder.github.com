/**
 * Module dependencies.
 */

// mongoose setup
require('./db');

var express = require('express'),
    routes = require('./routes'),
    webapp = require('./routes/app'),
    http = require('http'),
    path = require('path'),
    app = express(),
    conf = require('./config'),
    logger = require('./logger');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(require('connect-multiparty')({ uploadDir: conf.root_path + 'public/file' }));
app.use(express.methodOverride());
app.use(express.cookieParser('mte'));//secret
app.use(express.session());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

// 格式化jade输入的html
app.configure('development', function () {
    app.use(express.errorHandler());
    //app.locals.pretty = true;
});

//logger
logger.use(app);

// route与server分离
// http://www.cnblogs.com/pigtail/archive/2013/01/14/2859297.html
// http://cnodejs.org/topic/503cf635f767cc9a5123dd8b
app.get('/', routes.index);
app.get('/platform', routes.index);
app.get('/load', routes.load);
app.post('/create', routes.create);
app.get('/destory/:id', routes.destory);
app.get('/edit/:id', routes.edit);
app.post('/update/:id', routes.update);
app.get('/app', webapp.index);
app.get('/appview/:id', webapp.appview);
app.post('/appview/reply/:id', webapp.reply);
app.get('/appview/comments/:id', webapp.comments);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
