/**
 * @Copyright (c) 2014,Tencent Inc. All rights reserved.
 * @update $Id: logger.js 16439 2014-03-26 05:10:09Z samgui $
 */

//https://github.com/nomiddlename/log4js-node
//https://github.com/baryon/tracer
var log4js = require('log4js'), logger;

log4js.configure({
    appenders: [
        {
            type: 'console',
            category: 'console'
        },
        {
            type: 'file',
            filename: 'logs/access.log',
            pattern: "_yyyy-MM-dd",
            alwaysIncludePattern: false,
            maxLogSize: 20480,
            backups: 10,
            category: 'normal'
        }
    ],
    replaceConsole: true
});

logger = log4js.getLogger('normal');
logger.setLevel('INFO');

exports.use = function (app) {
    app.use(log4js.connectLogger(logger, {
            level: log4js.levels.INFO,
            format: ':method :url'}
    ));
}

// 暴露log4js给控制器
exports.logger = function (name) {
    var logger = log4js.getLogger(name);
    logger.setLevel('INFO');
    return logger;
}