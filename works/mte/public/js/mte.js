/**
 * @Copyright (c) 2014,Tencent Inc. All rights reserved.
 * @update $Id: mte.js 16457 2014-03-27 11:33:40Z samgui $
 */

/**
 * MTE全局变量
 */
var MTE = MTE || {};

/**
 * 本地变量
 */
MTE.locals = {
    upload_tip: '点击浏览/拖放图片到此处(600x200)',
    please_input_manager: '请输入接口人的英文ID',
    please_input_receiver: '请输入关注人的英文ID',
    no_data: '暂无数据',
    say_something: '还没有人发表评论，说点啥吧...'
}

/**
 * MTE 管理平台
 */
MTE.platform = {
    valid: false,
    init: function () {
        MTE.platform.load(1);

        $('.ui_form_fake_file').html(MTE.locals.upload_tip);
        $('#manager').attr('placeholder', MTE.locals.please_input_manager);
        $('#receiver').attr('placeholder', MTE.locals.please_input_receiver);
        $('#receiver').attr('placeholder', MTE.locals.please_input_receiver);

        // 搜索
        $('.search_form .ui_form_button').click(function () {
            MTE.platform.load(1);
            return false;
        });

        $('.ui_form .ui_form_button').click(function () {
            $('.ui_form_row input').each(function () {
                return MTE.platform.validate(this);
            });

            return MTE.platform.valid;
        });

        $('.ui_form_row input').bind('keyup blur change', function () {
            return MTE.platform.validate(this);
        });

        $('#image').hover(function () {
            if ($('#project_id').val() != '') {
                $('.ui_popover').show();
            }
        },function () {
            $('.ui_popover').hide();
        }).change(function () {
            var image = this.value.split('\\')[2];
            $('.ui_form_fake_file').html(image);
        });
    },
    validate: function (o) {
        var id = o.id,
            pid = $('#project_id').val(),
            val = $.trim(o.value),
            input = $(o),
            error = MTE.platform.error,
            success = MTE.platform.success;

        if (val == '' || (id == 'image' && pid == '' && val == '')) {
            return error(input);
        } else {
            if (id == 'url' && !MTE.validator.url(val)) {
                return error(input);
            } else {
                return success(input);
            }
        }
    },
    error: function (input) {
        var row = input.parents('.ui_form_row');
        MTE.platform.valid = false;
        input.focus();
        row.addClass('error');
        return false;
    },
    success: function (input) {
        var row = input.parents('.ui_form_row');
        MTE.platform.valid = true;
        row.removeClass('error');
        return true
    },
    load: function (page) {
        var keyword = $.trim($('.ui_form_input').val()),
            tpl = $('#tpl_projects').html();

        MTE.api.load(page, keyword, function (data) {
            var projects = data.projects, html = '';

            if (projects.length > 0) {
                $.each(projects, function (index, project) {
                    var remark = project.remark,
                        image = project.image,
                        image = image ? image : 'holder.png';

                    html += tpl.replace(/{id}/gm, project._id)
                        .replace(/{name}/gm, project.name)
                        .replace(/{tag}/gm, (project.tag == '0' ? '项目' : '组件'))
                        .replace(/{image}/gm, image)
                        .replace(/{manager}/gm, project.manager)
                        .replace(/{url}/gm, project.url)
                        .replace(/{remark}/gm, remark)
                        .replace(/{breif_remark}/gm, MTE.helper.substr(remark, 20))
                        .replace(/{updated_at}/gm, MTE.helper.dateformat(project.updated_at, 'yyyy-mm-dd hh:mm:ss'));
                });
            } else {
                html += '<tr><td colspan="8">' + MTE.locals.no_data + '</td></tr>';
            }

            $('.ui_table tbody').html(html);

            $('.ui_table tbody tr').hover(function () {
                $(this).addClass('row_hover');
            }, function () {
                $(this).removeClass('row_hover');
            });

            // 编辑
            $('.lnk_edit').click(function () {
                var id = $(this).data('id');
                MTE.api.edit(id);
            });

            // 删除
            $('.lnk_destory').click(function () {
                $('body').addClass('filter_blur');
                $('.ui_dialog .lnk_ok').data('id', $(this).data('id'));
            });

            $('.ui_dialog .lnk_ok').click(function () {
                var id = $(this).data('id');
                MTE.api.destory(id);
                $('body').removeClass('filter_blur');
            });

            $('.ui_dialog .lnk_cancel').click(function () {
                $('body').removeClass('filter_blur');
            });

            $('.ui_paginator').paginator({
                pageSize: data.limit,
                total: data.total,
                pageIndex: page,
                callback: 'MTE.platform.load'
            });
        });
    }
}

/**
 * MTE App
 */
MTE.app = {
    init: function () {
        var mte = localStorage.getItem('mte');

        if (null == mte) {
            localStorage.setItem('mte', '{"ids":[],"mode":1}');
        }

        mte = JSON.parse(localStorage.getItem('mte'));
        $('body')[(mte.mode == '1' ? 'add' : 'remove') + 'Class']('list_view');

        $('.btn_list').click(function () {
            $('body').toggleClass('list_view');
            MTE.app.mode($('body').hasClass('list_view'));
        });

        $('.icon_search').click(function () {
            $('body').addClass('filter_blur');
            $('.keyword').focus();
        });

        $('.keyword').keyup(function () {
            MTE.app.load(1);
        });

        $('.lnk_cancel').click(function () {
            $('body').removeClass('filter_blur');
            $('.keyword').val('');
            MTE.app.load(1);
        });

        MTE.app.load(1);
    },
    load: function (page) {
        var keyword = $.trim($('.keyword').val()),
            mte = JSON.parse(localStorage.getItem('mte')),
            ids = mte.ids,
            tpl = $('#tpl_star_projects').html();

        $('.loading').show();

        MTE.api.load(page, keyword, function (data) {
            var projects = data.projects,
                list = $('body').hasClass('list_view'),
                html = '', stars = [], unstars = [], id;

            if (data.total > 0) {
                if (data.total < data.limit) {
                    $('.load_more').hide();
                }

                //分开加星项目
                $.each(projects, function (index, project) {
                    if (ids.indexOf(project._id) > -1) {
                        stars.push(project);
                    } else {
                        unstars.push(project);
                    }
                });

                //加星项目根据本地存储的顺序排序
                stars.sort(function (a, b) {
                    return ids.indexOf(a._id) > ids.indexOf(b._id);
                });

                $.each(stars, function (index, project) {
                    var image = project.image,
                        remark = project.remark,
                        image = image ? image : 'holder.png' ,
                        remark = remark ? remark : '[无备注信息]',
                        remark = list ? MTE.helper.substr(remark, 44) : remark;

                    html += tpl.replace(/{id}/gm, project._id)
                        .replace(/{name}/gm, project.name)
                        .replace(/{image}/gm, image)
                        .replace(/{url}/gm, project.url)
                        .replace(/{remark}/gm, remark);
                });

                tpl = $('#tpl_unstar_projects').html();

                $.each(unstars, function (index, project) {
                    html += tpl.replace(/{id}/gm, project._id)
                        .replace(/{name}/gm, project.name)
                        .replace(/{url}/gm, project.url);
                });

            } else {
                html += '<li class="nodata">' + MTE.locals.no_data + '</li>';
                $('.load_more').hide();
            }

            $('.loading').hide();
            $('.projects').html(html);

            $('.icon_star').click(function () {
                var $me = $(this),
                    id = $me.data('id'),
                    project = $me.parents('.project'),
                    projects = $('.projects .project'),
                    index = projects.index(project);

                project.toggleClass('starred');

                if (project.hasClass('starred') && index != 0) {
                    var proj = project.remove();
                    $('.projects').prepend(proj);
                }

                MTE.app.star();
                MTE.app.load(1);
                return false;
            });
        });
    },
    star: function () {
        var mte = JSON.parse(localStorage.getItem('mte')), ids = [];

        $('.starred .icon_star').each(function () {
            ids.push($(this).data('id'));
        });

        mte.ids = ids;
        localStorage.setItem('mte', JSON.stringify(mte));
    },
    mode: function (list) {
        var mte = JSON.parse(localStorage.getItem('mte'));
        mte.mode = list ? 1 : 0;
        localStorage.setItem('mte', JSON.stringify(mte));
    }
}

MTE.appview = {
    init: function () {
        var project = $('.project'),
            id = $('input[name="project_id"]').val(),
            mte = JSON.parse(localStorage.getItem('mte')),
            ids;

        if (null == mte) {
            localStorage.setItem('mte', '{"ids":[],"mode":1}');
        }
        mte = JSON.parse(localStorage.getItem('mte'));
        if (mte.ids.indexOf(id) != -1) {
            project.addClass('starred');
        }

        $('.icon_star').click(function () {
            project.toggleClass('starred');
            MTE.appview.star(project.hasClass('starred'));
            return false;
        });

        MTE.appview.load(1);

        $('.btn_reply').click(function () {
            $('.loading').show();

            MTE.api.async({
                url: 'appview/reply/' + id,
                type: 'POST',
                data: $('.ui_form').serialize(),
                success: function (data) {
                    if (data.state == 1) {
                        $('.reply').val('');
                        MTE.appview.load(1);
                    }
                }
            });

            return false;
        });
    },
    load: function () {
        var tpl = $('#tpl_comments').html(),
            id = $('input[name="project_id"]').val();

        MTE.api.async({
            url: 'appview/comments/' + id,
            success: function (data) {
                var comments = data.comments, html = '';
                if (comments.length > 0) {
                    $.each(comments, function (index, comment) {
                        html += tpl.replace(/{myself}/gm, (comment.user_id == data.user_id ? ' even' : ''))
                            .replace(/{user_id}/gm, comment.user_id)
                            .replace(/{content}/gm, comment.content)
                            .replace(/{added_at}/gm, MTE.helper.dateformat(comment.added_at, 'yyyy-mm-dd hh:mm:ss'));
                    });
                } else {
                    html += '<li class="nodata">' + MTE.locals.say_something + '</li>';
                }
                $('.loading').hide();
                $('.comments').html(html);

                $('.nodata').click(function () {
                    $('.reply').focus();
                });
            }
        });
    },
    star: function (starred) {
        var id = $('input[name="project_id"]').val(),
            mte = JSON.parse(localStorage.getItem('mte')),
            ids = mte.ids,
            index = ids.indexOf(id);

        if (starred) {
            if (index != -1) {
                if (index != 0) {
                    ids.splice(index, 1);
                }
            }

            ids.unshift(id);
        } else {
            if (index != -1) {
                ids.splice(index, 1);
            }
        }

        mte.ids = ids;
        localStorage.setItem('mte', JSON.stringify(mte));
    },
}

/**
 * 工具函数
 */
MTE.helper = {
    /**
     * 拼装url
     * @param url
     * @returns {string}
     */
    url: function (url) {
        return 'http://localhost:3000/' + url;
    },
    /**
     * 粘贴图像并获取数据，仅 Chrome 支持
     * @param ev
     * @param callback
     * @returns {boolean}
     */
    paste: function (ev, callback) {
        var clipboardData, items, item;

        // 判断剪贴板中是否有图片
        if (ev && (clipboardData = ev.clipboardData)
            && (items = clipboardData.items)
            && (item = items[0])
            && item.kind == 'file'
            && item.type.match(/^image\//i)) {
            var blob = item.getAsFile(), reader = new FileReader();

            reader.onload = function () {
                callback && callback(event.target.result);
            };

            reader.readAsDataURL(blob);
            return false;
        }
    },
    /**
     * 日期格式化
     * @param strdate 日期字符串
     */
    dateformat: function (strdate, format) {
        var date = new Date(strdate);

        switch (format) {
            case 'yyyy-mm-dd':
                strdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
                break;
            case 'yyyy-mm-dd hh:mm:ss':
                strdate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
                    + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                break;
        }
        return strdate;
    },
    /**
     * 中英文字符串截取
     * @param str
     * @param n
     * @returns {*}
     */
    substr: function (str, n) {
        var r = /[^\x00-\xff]/g;
        if (str.replace(r, "mm").length <= n) {
            return str;
        }
        var m = Math.floor(n / 2);
        for (var i = m; i < str.length; i++) {
            if (str.substr(0, i).replace(r, "mm").length >= n) {
                return str.substr(0, i) + "...";
            }
        }
        return str;
    }
}

MTE.validator = {
    url: function (input) {
        return /((http|ftp|https|file):\/\/([\w\-]+\.)+[\w\-]+(\/[\w\u4e00-\u9fa5\-\.\/?\@\%\!\&=\+\~\:\#\;\,]*)?)/ig.test(input);
    }
}

/**
 * API
 */
MTE.api = {
    async: function (d) {
        var url = d.url || '',
            type = d.type || 'GET',
            data = d.data || {},
            cache = d.cache || false,
            dataType = d.dataType || 'json',
            success = d.success,
            error = d.error;

        $.ajax({
            url: MTE.helper.url(url),
            type: type,
            data: data,
            cache: cache,
            dataType: dataType,
            success: function (result) {
                success && success(result);
            },
            error: function () {
                error && error();
            }
        });
    },
    edit: function (id) {
        MTE.api.async({
            url: 'edit/' + id,
            success: function (data) {
                var project = data.project, image = project.image;

                $('#project_id').val(project._id);
                $('#name').val(project.name);
                $('.ui_form_radio[value="' + project.tag + '"]').attr('checked', true);
                $('.ui_form_fake_file').html(image);
                $('.img_preview').attr('src', 'file/' + image);
                $('#url').val(project.url);
                $('#managerValue,#manager').val(project.manager);
                $('#receiverValue,#receiver').val(project.receiver);
                $('#remark').val(project.remark);
                $('.ui_form').attr('action', 'update/' + id);
            }
        });
    },
    create: function () {
        MTE.api.async({
            url: 'create/',
            type: 'POST',
            data: $('.ui_form').serialize(),
            success: function (data) {
                if (data.state == 1) {
                    MTE.platform.load(1);
                }
            }
        });
    },
    destory: function (id) {
        MTE.api.async({
            url: 'destory/' + id,
            success: function (data) {
                if (data.state == 1) {
                    MTE.platform.load(1);
                }
            }
        });
    },
    load: function (page, keyword, callback) {
        MTE.api.async({
            url: 'load',
            data: {keyword: keyword, page: page},
            success: function (data) {
                callback && callback(data);
            }
        });
    },
    upload: function () {
        MTE.api.async({
            url: 'upload',
            data: {image: $('#uploader').val()},
            type: 'POST',
            success: function (data) {

            }
        });
    }
}