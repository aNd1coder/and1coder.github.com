/**
 * @Copyright (c) 2014,Tencent Inc. All rights reserved.
 * @update $Id: config.js 16445 2014-03-27 00:55:52Z samgui $
 */

exports.app_name = 'MTE移动触体验';
exports.base_url = 'http://d9.oa.com/mte/';
exports.root_path = '/var/www/html/mte/';
exports.passport_url = 'http://passport.oa.com/modules/passport';
exports.mail_sender = 'samgui@tencent.com';
exports.mail_title_template = '【MTE提醒】您关注的"{name}"已发布，赶快来体验吧';
exports.mail_body_template = '\
    <div style="color:#797979;font:normal 14px 微软雅黑">\
        <div style="margin-bottom: 5px;">请扫下面的二维码体验：</div>\
        <div style="margin-bottom: 100px;">\
            <img style="border: 1px solid #ddd;" src="http://chart.googleapis.com/chart?cht=qr&chs=200x200&chld=L|0&choe=UTF-8&chl={url}" width="200" height="200"/>\
        </div>\
        <table style="padding-top: 10px;border-top: 1px solid #ddd;">\
            <tr>\
                <td style="width: 90px;"><img style="border: 1px solid #ddd;" src="http://caocao.me/mteapp/qrcode.jpg" width="100" height="100"/></td>\
                <td style="vertical-align: top;">\
                    <div style="margin-top:10px;color:#797979;font:normal 14px 微软雅黑;">\
                        MTE － 移动触体验，更方便快捷的Demo初体验\
                        <br/>\
                        关注<span style="color: #ff4b54;">"MTE助手"</span>微信公众号，即时收取产品体验地址与手机端创新体验资讯。\
                    </div>\
                </td>\
            </tr>\
        </table>\
    </div>';
exports.limit = 6;
