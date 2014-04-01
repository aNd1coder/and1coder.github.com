/**
 * @Copyright (c) 2013,paipai Inc. All rights reserved.
 * @update $Id: shop.js 13218 2013-10-17 14:03:06Z samgui $
 */

var doc = document,
    oDropContainer ,
    oDrag,
    skinSelector,
    DEFAULT_WIDTH = 98,
    MAX_WIDTH = 950,
    toolBoxCls = ['toolbox_skin_selector', 'toolbox_slogan', 'toolbox_hotspot', 'toolbox_tooltip'],
    tipCls = ['skin_tip', 'fixed_tip'];

$(function () {
    App.Storage.init('App.Shop');
    init();
});

//初始化
function init() {
    var dataurl = App.Storage.get('dataurl'),
        skin = App.Storage.get('skin'),
        hotspot = App.Storage.get('hotspot'),
        preview = App.Storage.get('preview');

    oDropContainer = doc.getElementById('head_container');
    skinSelector = $('.skin_selector');

    if (hotspot) {
        $('.nav_container .hotspot_container').html(hotspot);
    }

    if (App.Storage.get('subtitle_zh')) {
        $('.subtitle .subtitle_zh').html(App.Storage.get('subtitle_zh'));
    }

    if (App.Storage.get('subtitle_en')) {
        $('.subtitle .subtitle_en').html(App.Storage.get('subtitle_en'));
    }

    if (App.Storage.get('headline')) {
        $('.headline').html(App.Storage.get('headline'));
    }

    if (dataurl) {
        skinSelector.find('.skin_custom_item').show();
    }

    if (skin) {
        $('#skin').attr('href', __skin('shop', skin));
        skinSelector.find('.skin_' + skin).addClass('current');

        if (skin == 'custom') { //自定义皮肤
            drawImage();
        } else {
            oDropContainer.removeAttribute('style');
        }
    }

    //测试拖放
    $('#demo').bind('selectstart',function () {
        return false;
    }).bind('dragstart',function (e) {
            e.dataTransfer.effectAllowed = "move";
            e.dataTransfer.setData("text", e.target.src);
            e.dataTransfer.setDragImage(e.target, 0, 0);
            oDrag = e.target;
            return true;
        }).bind('dragend', function (e) {
            e.dataTransfer.clearData("text");
            oDrag = null;
            return false;
        });

    //处理图片拖放
    $(oDropContainer).bind('dragover',function (e) {
        if (!$('body').hasClass('preview')) {
            this.style.outline = "3px dashed #e7376a";
        }

        e.stopPropagation();
        e.preventDefault();
    }).bind('dragleave',function (e) {
            this.style.outline = "";
            e.stopPropagation();
            e.preventDefault();
        }).bind('drop', function (e) {
            var files, type, reader;

            e.stopPropagation();
            e.preventDefault();

            if (oDrag) { //页面上直接拖放
                App.Storage.set('dataurl', oDrag.src);
                App.Storage.set('skin', 'custom');

                drawImage();
            } else {
                files = e.dataTransfer.files
                if (files.length > 0) {
                    type = files[0].type
                    reader = new FileReader();

                    if (type.indexOf('image') == -1) {
                        alert('请拖曳图片!');
                        return;
                    }

                    reader.onload = function (e) {
                        var imgAsDataURL = this.result;

                        App.Storage.set('dataurl', imgAsDataURL);
                        App.Storage.set('skin', 'custom');

                        drawImage();


                    };

                    reader.readAsDataURL(files[0]);
                } else {
                    this.style.outline = "";
                }
            }
        });

    //绑定热区
    $('.nav_container .unit').each(function () {
        bindHotspot(this);
    });

    if (preview == 'true') {
        $('body').addClass('preview');
        priview();
    }
    /*
     工具栏
     -------------------------------------*/

    //换肤
    $('.change_skin').click(function () {
        adjustToolboxPosition(this, toolBoxCls[0]);
    });

    //预览皮肤
    $('.preview_skin').click(function () {
        $('body').toggleClass('preview');
        priview();
    });

    $('.skin_selector .skin_item span').click(function () {
        var skinId;

        $('.skin_selector .current').removeClass('current');

        if (this.className.indexOf('current') == -1) {
            skinId = this.className.replace('skin_', '');
            $('#skin').attr('href', __skin('shop', skinId));

            this.className += ' current';

            if (skinId != 'custom') {
                oDropContainer.removeAttribute('style');
            } else {
                drawImage();
            }

            App.Storage.set('skin', skinId);
        }
    });

    $('.skin_selector,.skin_selector .skin_item span').mouseover(function () {
        $('.mod_tip').removeAttr('style').find('span').html($(this).data('skin'));
        toolTip(this, tipCls[0]);
    });

    $('.skin_selector').mouseout(function () {
        $('.mod_tip').hide();
    });

    //宣传语编辑
    $('.slogan_edit').click(function () {
        $('#headline').val($('.headline').html());
        $('#subtitle_zh').val($('.subtitle_zh').html());
        $('#subtitle_en').val($('.subtitle_en').html());
        adjustToolboxPosition(this, toolBoxCls[1]);
    });

    $('#headline,#subtitle_zh,#subtitle_en,.headline,.subtitle_zh,.subtitle_en').keyup(function () {
        var key, val;

        if (this.id) {
            key = this.id;
            val = this.value;

            $('.' + key).html(val);
        } else {
            key = this.className;
            val = this.innerHTML;

            $('#' + key).val(val);
        }

        App.Storage.set(key, val);
    });

    //新增热区单元
    $('.new_hotspot').click(function () {
        newHotspot();
    });

    //重置热区单元
    $('.reset_hotspot').click(function () {
        App.Storage.set('hotspot', '');
        location.reload();
    });

    //右键编辑热区
    $('.nav_container .unit').live('contextmenu',function () {
        App.Storage.set('current_hotspot_id', this.id);
        setHotspot(this);
        adjustToolboxPosition(this, toolBoxCls[2]);

        return false;
    }).live('click', function () {
            var me = $(this), maxzIndex;

            if (!me.hasClass('current')) {
                maxzIndex = (+App.Storage.get('max_z_index')) + 1;//设置当前选中单元为最顶层
                me.addClass('current').css({'z-index': maxzIndex}).siblings().removeClass('current');
                App.Storage.set('current_hotspot_id', this.id);
                App.Storage.set('max_z_index', maxzIndex);
            }

            updateHotspots();

            //非预览状态下消除连接默认行为
            if (!$('body').hasClass('preview')) {
                return false;
            }
        });

    //关闭工具箱
    $('.mod_close').click(function () {
        $('.toolbox_container').hide();
        updateHotspots();

        return false;
    });

    //小提示
    if (App.Storage.get('show_fixed_tip') != 'false') {
        $('#head_container>.mod_tip').addClass('fixed_tip');
    }

    $('.fixed_tip .mod_close').click(function () {
        $('.fixed_tip').removeClass('fixed_tip');
        App.Storage.set('show_fixed_tip', 'false');
    });

    $(doc).keydown(function (e) {
        var current = $('.nav_container .current'), obj, keyCode = e.keyCode, id;

        // 向上关闭编辑面版
        if (keyCode == 38) {
            $('.toolbox_container').hide();
        }

        // 向下展开编辑面版
        if (keyCode == 40) {
            current.trigger('contextmenu');
        }

        // delete/左右方向键,自动选中前/后兄弟单元
        if (keyCode == 46) {
            if (current.prev('.unit').length > 0) {
                current.removeClass('current').prev('.unit').addClass('current');
            } else {
                current.removeClass('current').next('.unit').addClass('current');
            }
        }

        if (keyCode == 37 && current.prev('.unit').length > 0) {
            current.removeClass('current').prev('.unit').addClass('current');
        }

        if (keyCode == 39 && current.next('.unit').length > 0) {
            current.removeClass('current').next('.unit').addClass('current');
        }

        // ESC关闭工具栏及提示层
        if (keyCode == 27) {
            $('.toolbox_container,.mod_tip').hide();
        }

        obj = $('.nav_container .current');
        id = obj.attr('id');
        App.Storage.set('current_hotspot_id', id);

        // delete删除当前单元
        if (e.keyCode == 46) {
            removeHotspot(current.find('i'))
        }
    }).click(function (e) {
            var tagName = e.target.tagName;
            if (tagName == 'HTML' || tagName == 'BODY') {
                $('.toolbox_container,.mod_tip').hide();
            }
        });
}


/**
 * 皮肤路径
 * @param proj  所属项目
 * @param skin  皮肤id
 * @param cacheable 是否缓存
 * @returns {string}
 * @private
 */
function __skin(proj, skin, cacheable) {
    skin = skin + '.css' + (cacheable ? '' : '?_=' + (+new Date()));
    return App.Helper.url('public/skin/' + proj + '/' + skin);
}

//绘制背景图片
function drawImage() {
    var style = oDropContainer.style, dataurl = App.Storage.get('dataurl');

    style.backgroundImage = 'url(' + dataurl + ')';
    style.outline = "";

    $('#skin').attr('href', __skin('shop', 'custom'));

    skinSelector.find('.skin_custom_item').show()
        .end().find('.current').removeClass('current')
        .end().find('.skin_custom').addClass('current');
}

//创建热区
function newHotspot() {
    var me = $('.nav_container .hotspot_container'),
        units = me.find('.unit'),
        lastUnit,
        newUnit,
        len = units.length,
        zIndex = 1000,
        width = DEFAULT_WIDTH,
        id = 'unit_' + (+new Date()),
        left ,
        cssText,
        txt = '菜单' + len;

    //已包含热区单元则以最后一个热区为模版添加新热区
    if (len > 0) {
        lastUnit = units.last();
        width = lastUnit.outerWidth();
        zIndex = lastUnit.css('z-index') - 1;
        left = parseInt(lastUnit.css('left')) + width;
        //根据鼠标点击位置/按顺序添加
        left = Math.min(left, (MAX_WIDTH - DEFAULT_WIDTH));
    } else {
        left = Math.min(DEFAULT_WIDTH * len, (MAX_WIDTH - DEFAULT_WIDTH));
    }

    cssText = 'width:' + width + 'px;left:' + left + 'px;z-index:' + zIndex;
    newUnit = $('<a href="#" class="unit" style="' + cssText + '" target="_blank"><span></span><i title="删除" class="mod_close"></i></a>');

    newUnit.attr({'id': id}).appendTo(me);
    newUnit.addClass('current').find('span').html(txt).end().siblings().removeClass('current');

    updateHotspots();
    bindHotspot('#' + id);
}

//绑定热区
function bindHotspot(o) {
    var container = $('.nav_container'),
        height = container.height();//热区高度

    $(o).draggable({
        axis: "x",
        snap: true,
        containment: "parent",
        start: function (event, ui) {
            var me = ui.helper;
            me.addClass('current').siblings().removeClass('current');
        },
        drag: function (event, ui) {
            var me = ui.helper;
            adjustToolboxPosition(me[0], toolBoxCls[2]);
            $('#prop_left').val(me.css('left').replace('px', ''));
        },
        stop: function () {
            updateHotspots();
        }
    }).resizable({
            minWidth: DEFAULT_WIDTH,
            minHeight: height,
            maxHeight: height,
            containment: 'parent',
            start: function (event, ui) {
                ui.helper.addClass('current').siblings().removeClass('current');
            },
            resize: function (event, ui) {
                var me = ui.helper;
                adjustToolboxPosition(me[0], toolBoxCls[2]);
                $('#prop_width').val(me.css('width').replace('px', ''));
            },
            stop: function (event, ui) {
                updateHotspots();
            }
        }).find('i').click(function () {
            removeHotspot(this);
            return false;
        });
}

//删除热区
function removeHotspot(o) {
    var unit = $(o).parent('.unit'),
        len = $('.toolbox_container .unit').length;

    //如果为当前编辑中的菜单则隐藏编辑面版
    if (unit[0].id == App.Storage.get('current_hotspot_id') || len == 0) {
        $('.toolbox_container,.mod_tip').hide();
    }

    unit.remove();
    updateHotspots();
}

//更新热区
function updateHotspots() {
    var tmp = $('.nav_container .hotspot_container').clone(), html;

    tmp.find('div.ui-resizable-handle').remove().end()
        .find('.unit').attr('class', 'unit');

    html = tmp.html().replace(/^\s+|\s+$/g, '');

    App.Storage.set('hotspot', '');
    App.Storage.set('hotspot', html);
}

//编辑热区属性
function setHotspot(o) {
    var o = $(o),
        txt = o.find('span'),
        href = o.attr('href');

    o.addClass('current').siblings().removeClass('current');

    //设置文字
    $('#prop_text').val(txt.html()).unbind('keyup').keyup(function () {
        txt.text($(this).val());
        updateHotspots();
        return false;
    });

    //设置连接
    $('#prop_link').val(href).unbind('keyup').keyup(function () {
        o.attr('href', $(this).val());
        updateHotspots();
        return false;
    });
}

//调整工具箱位置
function adjustToolboxPosition(me, curCls) {
    var bcr = me.getBoundingClientRect(),
        top = bcr.top + me.offsetHeight + 10,
        left = bcr.left,
        container = $('.toolbox_container'),
        angle = container.find('.angle'),
        allCls = toolBoxCls.join(' '),
        curCls = curCls || '',
        isOverflow,
        width;

    container.removeClass(allCls).addClass(curCls);

    width = $('.' + curCls).outerWidth();

    //是否已越界
    isOverflow = (left - oDropContainer.getBoundingClientRect().left + width) > MAX_WIDTH;

    left = isOverflow ? (left - width + me.offsetWidth) : left;

    //设置箭头的位置
    if (isOverflow) {
        angle.css({'left': 'auto', 'right': '30px'});
    } else {
        angle.css({'left': '30px', 'right': 'auto'});
    }

    container.css({'top': top + 'px', 'left': left + 'px'}).show().find('input:visible:first').focus().select();
}

//提示
function toolTip(me, curCls) {
    var me = $(me), tip = $('.mod_tip'),
        left = parseInt(me.css('left'));

    left = Math.min(left, MAX_WIDTH - tip.outerWidth());
    tip.removeClass(tipCls.join(' ')).addClass(curCls).css('left', left + 'px').show();
}

//预览
function priview() {
    var btn = $('.preview_skin'),
        slogan = $('.headline,.subtitle_zh,.subtitle_en'),
        unit = $(".nav_container .unit");

    if ($('body').hasClass('preview')) {
        btn[0].innerHTML = '取消预览';
        App.Storage.set('preview', 'true');
        slogan.attr('contenteditable', false);
        unit.draggable("option", "disabled", true);
    } else {
        btn[0].innerHTML = '预览';
        App.Storage.set('preview', 'false');
        slogan.attr('contenteditable', true);
        unit.draggable("option", "disabled", false);
    }
}
