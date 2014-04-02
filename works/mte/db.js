/*
 * Mongoose
 * http://dreamerslab.com/blog/tw/write-a-todo-list-with-express-and-mongodb/
 */

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//项目
var Project = new Schema({
    name: String,       //名称
    tag: String,        //标签
    image: String,      //截图
    url: String,        //访问地址
    developer: String,  //开发者
    manager: String,    //负责人
    receiver: String,   //关注人
    remark: String,     //备注
    updated_at: Date    //更新时间
});

//评论
var Comment = new Schema({
    user_id: String,    //评论者
    project_id: String, //项目编号
    content: String,    //评论内容
    added_at: Date      //添加时间
});

mongoose.model('Project', Project);
mongoose.model('Comment', Comment);

mongoose.connect('mongodb://localhost/mte');