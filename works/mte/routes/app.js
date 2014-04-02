/**
 * @Copyright (c) 2014,Tencent Inc. All rights reserved.
 * @update $Id: app.js 16457 2014-03-27 11:33:40Z samgui $
 */

var mongoose = require('mongoose'),
    Project = mongoose.model('Project'),
    Comment = mongoose.model('Comment');

//MTE App
exports.index = function (req, res) {
    res.render('app');
};

exports.appview = function (req, res, next) {
    Project.findById(req.params.id, function (err, project) {
        if (err) return next(err);
        res.render('appview', {project: project});
    });
};

//数据查询
exports.comments = function (req, res, next) {
    var user_id = req.session.user ? req.session.user : '匿名';
    //查询数据
    Comment.find({project_id: req.params.id}, null, {
        sort: {
            'added_at': -1  //DESC
        }
    }, function (err, rows) {
        if (err) return next(err);

        res.send({ comments: rows, user_id: user_id});
    });
};

//回复
exports.reply = function (req, res, next) {
    var comment = new Comment({
        user_id: req.session.user,
        project_id: req.body.project_id,
        content: req.body.content,
        added_at: Date.now()
    });

    comment.save(function (err) {
        if (err) return next(err);

        res.send({state: 1});
    });
};