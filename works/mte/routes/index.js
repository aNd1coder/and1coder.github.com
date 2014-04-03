var fs = require('fs'),
    mongoose = require('mongoose'),
    conf = require('../config'),
    Project = mongoose.model('Project');

//首页
exports.index = function (req, res) {
    res.render('platform', { title: '首页' });
};

//数据查询
exports.load = function (req, res, next) {
    var total, //总记录数
        page = req.query.page || 1, //当前页
        limit = conf.limit, //每页记录数
        keyword = req.query.keyword || '', //查询关键字
        page = parseInt(page),
        skip = (page * limit) - limit, //开始记录
        where,//查询条件
        pattern = new RegExp("^.*" + keyword + ".*$");//模糊匹配

    //模糊查询
    where = keyword == '' ? {} : {"$or": [
        {name: pattern},
        {developer: pattern},
        {manager: pattern},
        {remark: pattern}
    ]};

    //统计总记录数
    Project.count(where, function (err, count) {
        total = count;
    });

    //查询数据
    Project.find(where, null, {
        limit: limit,
        skip: skip,
        sort: {
            'updated_at': -1  //DESC
        }
    }, function (err, rows) {
        if (err) return next(err);

        res.send({
            projects: rows,
            total: total,
            limit: limit
        });
    });
};

//创建
exports.create = function (req, res, next) {
    var file = req.files.image,
        image = file.name;

    if (image) {
        fs.renameSync(file.path, conf.root_path + 'public/file/' + image);
    }

    var project = new Project({
        name: req.body.name,
        tag: req.body.tag,
        image: image,
        url: req.body.url,
        developer: 'samgui',
        manager: req.body.manager.replace(';', ''),
        receiver: req.body.receiver,
        remark: req.body.remark,
        updated_at: Date.now()
    });

    project.save(function (err) {
        if (err) return next(err);

        res.redirect(conf.base_url);
    });
};

//删除
exports.destory = function (req, res, next) {
    Project.findById(req.params.id, function (err, project) {
        project.remove(function (err) {
            if (err) return next(err);

            res.send({state: 1});
        });
    });
};

//编辑
exports.edit = function (req, res, next) {
    var id = req.params.id;
    id = mongoose.Types.ObjectId(id);

    Project.findById(id, {
        _id: true,
        name: true,
        tag: true,
        image: true,
        url: true,
        manager: true,
        receiver: true,
        remark: true
    }, function (err, row) {
        if (err) return next(err);

        res.send({project: row});
    });
};

//更新
exports.update = function (req, res, next) {
    var id = req.params.id, file = req.files.image,
        image = file.name;

    if (image) {
        fs.renameSync(file.path, conf.root_path + 'public/file/' + image);
    }

    Project.findById(id, function (err, project) {
        project.name = req.body.name;
        project.tag = req.body.tag;
        if (image) {
            project.image = image;
        }
        project.url = req.body.url;
        project.developer = 'samgui';
        project.manager = req.body.manager.replace(';', '');
        project.receiver = req.body.receiver;
        project.remark = req.body.remark;
        project.updated_at = Date.now();

        project.save(function (err, row, count) {
            if (err) return next(err);

            res.redirect(conf.base_url);
        });
    });
};