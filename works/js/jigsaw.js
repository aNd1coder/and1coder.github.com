/**
 * @Copyright (c) 2013,paipai Inc. All rights reserved.
 * @update $Id: jigsaw.js 15915 2014-01-15 02:40:52Z samgui $
 */

var doc = $(document), body = doc.find('body'),
    desktop = $('#desktop'), sidebar = $('#sidebar'), statusbar = $('#statusbar'),
    canvas = $('#canvas'), container = $('#canvas-container'), curItem,
    contextmenu = $('#contextmenu'),
    propertyPanel = $('#property-panel'),
    editor = $('#editor'), editorToolbar = $('#editor-toolbar'), editorContainer = $('#editor-container'),
    canvasJson, canvasId, canvasName, canvasTop , canvasLeft , canvasWidth, canvasHeight, canvasBg, canvasBgColor,
    disabled, viewMode, hasChange, isInit;

$(function () {
    init();
});

window.onload = function () {
    //等比例缩放商品图
    $('.image-gallery img').each(function () {
        App.Helper.autoResizeImage(95, 95, this);
    });
};

//初始化
function init() {
    //初始化本地存储
    App.Storage.init('App.Jigsaw');
    viewMode = App.Storage.get('viewMode');
    canvasJson = App.Storage.get('canvasJson');
    canvasBg = App.Storage.get('bg');
    //hasChange = App.Storage.get('hasChange');
    isInit = true;
    //hasChange = (hasChange == '1');
    loadTpls();

    body[(viewMode != '' || canvasJson == '' ? 'add' : 'remove') + 'Class']('design-mode');
    toggleViewMode();

    //模版是否有未保存的更改
    //showNotify();

    //设置画布宽高
    $('#canvas-name,#canvas-width,#canvas-width,#canvas-height,#canvas-bgcolor').change(function () {
        setCanvasProperty();
    });

    //阻止桌面以及画布拖放事件
    $(desktop, container).bind('dragover dragleave drop', function () {
        return false;
    });

    container
        .bind('drop', function (e) {
            var files = e.dataTransfer.files,
                len = files.length,
                file, type, reader;

            e.stopPropagation();
            e.preventDefault();

            if (len > 0) {
                file = files[0];
                type = file.type
                reader = new FileReader();

                if (type.indexOf('image') == -1) {
                    alert('请拖曳图片!');
                    return false;
                }

                reader.onload = function () {
                    var img = new Image(), src = this.result, w, h;

                    img.src = src;

                    img.onload = function () {
                        w = img.width;
                        h = img.height;
                        container.css({
                            width: w + 'px',
                            height: h + 'px',
                            background: 'url(' + src + ')'
                        }).attr('data-bg', src);
                        canvasBg = src;
                        App.Storage.set('bg', canvasBg);
                        $('#canvas-width').val(w);
                        $('#canvas-height').val(h);
                        canvasWidth = w;
                        canvasHeight = h;
                        updateCanvas();
                    }
                };

                reader.readAsDataURL(file);
            }
        })
        .find('.item')
        .live('click', function () {
            var me = $(this);

            contextmenu.hide();
            editor.hide();

            me.addClass('current')
                .css('outline-color', me.find('span').css('color'))
                .siblings()
                .removeClass('current');

            if (!disabled) {
                $('#hs-top').val(parseInt(me.css('top')));
                $('#hs-left').val(parseInt(me.css('left')));
                $('#hs-width').val(me.width());
                $('#hs-height').val(me.height());
                //$('#hs-opacity').val(me.find.css('top'));

                propertyPanel
                    .css({
                        left: canvasLeft,
                        width: canvasWidth
                    })
                    .slideDown(200);
            }

            return false;
        })
        .live('dblclick', function () {
            adjustEditor($(this));
        })
        .live('contextmenu', function (e) {
            var top, left;

            curItem = $(this);
            curItem.addClass('current').siblings().removeClass('current');

            if (disabled && curItem.hasClass('image')) {
                top = e.clientY, left = e.clientX;
                $('#p_text').val(curItem.attr('title'));
                $('#p_link').val(curItem.attr('href'));
                editor.hide();
                contextmenu.hide();
                contextmenu.show().css({top: top, left: left})
                    .find('input:first').focus().stop()
                    .find('.label-success').html();
            }
            return false;
        })
        .live('click', function () {
            if (!disabled) {
                $(this).select();
            }
        });

    //右键菜单
    contextmenu.find('.btn').click(function () {
        switch (this.id) {
            case 'btn_close':
                contextmenu.hide();
                break;
            case 'btn_sub':
                setHotspotProperty(curItem);
                $(this).prevAll('.label-success').html('设置成功!');
                break;
        }
    });

    //工具栏
    $('.toolbar .btn').click(function () {
        switch (this.id) {
            case 'btn-view-mode': //切换模式
                body.toggleClass('design-mode');
                toggleViewMode();
                contextmenu.hide();
                editor.hide();
                break;
            case 'btn-dl-pic':
                container.find('.item').removeClass('current');
                App.Helper.download(container);
                break;
            case 'btn-gen-code':
                genCode();
                break;
            case 'btn-dl-pkg':
                var name = 'pp_' +
                    (new Date()).getTime() + '_' +
                    container.width() + 'x' +
                    container.height() + '.jpg';

                $.ajax({
                    type: "POST",
                    url: "/samgui/dl?m=jigsaw",
                    data: {name: name, data: canvasJson }
                }).done(function (data) {
                        showTip('打包成功!');
                        //$('#preview').removeClass('hide').find('.modal-body').html(data);
                        location.href = 'http://d9.oa.com/samgui/upload/' + data;
                    });

                break;
            case 'btn-clearcache':
                localStorage.removeItem('App.Jigsaw');
                break;
            case 'btn-fullscreen':
                var me = $(this).find('span'),
                    isfullscreen = me.data('isfullscreen');

                isfullscreen = isfullscreen && isfullscreen == '1';

                if (isfullscreen) {
                    document.webkitCancelFullScreen();
                } else {
                    document.documentElement.webkitRequestFullScreen();
                }

                me.html(isfullscreen ? '全屏浏览' : '退出全屏');
                me.data('isfullscreen', isfullscreen ? '0' : '1');

                break;
        }
    });

    //属性面版
    propertyPanel.find('input').change(function () {
        container.find('.current').css({
            top: $('#hs-top').val(),
            left: $('#hs-left').val(),
            width: $('#hs-width').val(),
            height: $('#hs-height').val()
        });
    });

    //画布工具栏
    $('.canvas-toolbar a').click(function () {
        switch (this.id) {
            case 'btn-clear':
                container.css('background-image', 'none').html('');
                canvasBg = '';
                App.Storage.set('bg', '');
                canvasBgColor = '#fff';
                updateCanvas();
                break;
            case 'btn-new-hotspot': //新建热区(默认图片热区)
                newHotspot();
                break;
            case 'btn-save-tpl': //保存模版
                var $name = $('#canvas-name');

                if ($.trim($name.val()) == '') {
                    $name.focus();
                    return false;
                } else {
                    $name.blur();
                }

                $.ajax({
                    type: "POST",
                    url: "/samgui/p/jigsaw/save_tpl",
                    data: { tpl: canvasJson }
                }).done(function (tplid) {
                        canvasId = tplid;
                        showTip('模版保存成功!');
                        App.Storage.set('hasChange', '0');
                        loadTpls();
                    });
                break;
        }
    });

    //新建模版
    $('#btn-new-tpl').click(function () {
        var input = $('.canvas-toolbar input[type=text]');
        $('#tpl-list a').removeClass('current');
        input.val('');
        input.first().focus();
        container.css('background-image', 'none').html('');
        canvasId = canvasName = canvasJson = '';
        updateCanvas();
    });

    //图库
    $('#btn-image-gallery').click(function () {
        statusbar.show(200);
    });

    // 复制代码
    var clip = new ZeroClipboard(document.getElementById("btn_copy"), {
        moviePath: App.Helper.url("public/vendor/ZeroClipboard.swf")
    });

    clip.on('complete', function () {
        $('#code .label-success').html('复制成功，请将代码粘贴到新建的页面片中或直接使用');
    });

    canvas.draggable({
        handle: '.canvas-toolbar',
        stop: function () {
            canvasTop = parseFloat(canvas.css('top'));
            canvasLeft = parseFloat(canvas.css('left'));

            updateCanvas();
        }
    });

    //文本编辑器
    editorContainer.keyup(function () {
        var text = $.trim(editorContainer.val());

        container
            .find('.current')[text == '' ? 'removeClass' : 'addClass']('ui-has-text')
            .find('span').html(text);
        updateCanvas();
    });

    $('span[contenteditable="true"]').live('keyup', function () {
        updateCanvas();
    });

    //文字对齐
    $('.btn-align .btn').click(function () {
        var me = $(this);
        me.addClass('active').siblings().removeClass('active');
        $('#canvas-container .current span,#editor-container')
            .css('text-align', me.data('align'));
        updateCanvas();
    });

    //文字加粗
    $('.btn-bold').click(function () {
        var me = $(this), fw;
        me.toggleClass('active');
        fw = me.hasClass('active') ? 'bold' : 'normal';
        $('#canvas-container .current span,#editor-container').css('font-weight', fw);
        updateCanvas();
    });

    //文字颜色
    $('.btn-forecolor').ColorPicker({
        onShow: function (colpkr) {
            $(colpkr).fadeIn(200);
            return false;
        },
        onHide: function (colpkr) {
            $(colpkr).fadeOut(200);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('.icon-forecolor').css('background-color', '#' + hex);
            $('#canvas-container .current span,#editor-container')
                .css('color', '#' + hex);
            updateCanvas();
        }
    });

    //背景颜色
    $('.btn-backcolor').ColorPicker({
        onShow: function (colpkr) {
            $('.colorpicker_transparent').show();
            $(colpkr).fadeIn(200);
            return false;
        },
        onHide: function (colpkr) {
            $('.colorpicker_transparent').hide();
            $(colpkr).fadeOut(200);
            return false;
        },
        onChange: function (hsb, hex, rgb) {
            $('.icon-backcolor').css('background-color', '#' + hex);
            $('#canvas-container .current span,#editor-container')
                .css('background-color', '#' + hex);
            updateCanvas();
        },
        onTransparent: function () {
            $('#canvas-container .current span,#editor-container,.icon-backcolor')
                .css('background-color', 'transparent');
            $('.colorpicker').hide();
            updateCanvas();
        }
    });

    //文字大小及行高
    $('.btn-fontsize,.btn-lineheight').click(function () {
        $(this).find('.dropdown-menu').toggle();
    });

    editorToolbar.find('.dropdown-menu a').click(function () {
        var me = $(this),
            val = me.data('value'),
            dd = me.parents('.dropdown-menu'),
            btn = me.parents('.btn'),
            attr = btn.hasClass('btn-lineheight') ? 'line-height' : 'font-size';

        dd.find('a').removeClass('active');
        me.addClass('active');
        $('#canvas-container .current span,#editor-container').css(attr, val + 'px');
        dd.hide();
        updateCanvas();
        return false;
    });

    sidebar.resizable({ handles: 'e' });
    statusbar.resizable({ handles: 'n' });

    //键盘操作
    doc
        .keydown(function (e) {
            var keyCode = e.keyCode,
                ctrlKey = e.ctrlKey,
                current = container.find('.current'),
                step;

            switch (keyCode) {
                case 27: //退出
                    $('#shortcut').hide();
                    current.removeClass('current');
                    break;
                case 37: //左
                    step = ctrlKey ? 5 : 1;
                    adjustHotspotProperty(current, 'left', -step);
                    break;
                case 38: //上
                    step = ctrlKey ? 5 : 1;
                    adjustHotspotProperty(current, 'top', -step);
                    break;
                case 39: //右
                    step = ctrlKey ? 5 : 1;
                    adjustHotspotProperty(current, 'left', step);
                    break;
                case 40://下
                    step = ctrlKey ? 5 : 1;
                    adjustHotspotProperty(current, 'top', step);
                    break;
                case 46: //删除
                    deleteHostpost();
                    break;
            }
        })
        .click(function (e) {
            if (e.target.className == 'desktop' ||
                e.target.className == 'canvas-container') {
                container.find('.current').removeClass('current');
                editor.hide();
                propertyPanel.slideUp(200);
            }
        });

    Mousetrap.bind("?", function () {
        $('#shortcut').show();
    });

    $('#tpl-list a').live('click', function () {
        if (this.className != 'current') {
            loadTpl(this);
        }
    });
}

//显示提示信息
function showTip(msg, tipCls) {
    var tipCls = tipCls || 'succss';
    $('#msgbox')
        .removeClass('success,error')
        .addClass(tipCls)
        .html(msg)
        .stop()
        .show()
        .fadeOut(5000);
}

//调整文本编辑器
function adjustEditor(el) {
    var span, top, left, height, text, color, bgcolor, ta;

    if (!disabled) {
        $('.dropdown-menu').hide();
        editor.show();
        span = el.find('span');
        height = el.height();
        text = span.html();
        ta = span.css('text-align');
        color = span.css('color');
        bgcolor = span.css('background-color');
        $('.btn-forecolor').ColorPickerSetColor(color);
        $('.icon-forecolor').css('background-color', color);
        $('.btn-backcolor').ColorPickerSetColor(bgcolor);
        $('.icon-backcolor').css('background-color', bgcolor);
        $('.btn-fontsize a[data-value=' + parseInt(span.css('font-size')) + ']').addClass('active');
        $('.btn-lineheight a[data-value=' + parseInt(span.css('line-height')) + ']').addClass('active');
        $('.btn-bold')[(span.css('font-weight') == 'bold' ? 'add' : 'remove') + 'Class']('active');
        $('.btn-align .btn[data-align=' + ta + ']')
            .addClass('active')
            .siblings()
            .removeClass('active');

        editorContainer
            .val(text)
            .css({
                width: el.width(),
                height: height,
                color: color,
                font: span.css('font'),
                'text-align': ta,
                'background-color': bgcolor
            })
            .focus();

        top = parseInt(el.css('top')) - editorToolbar.height() - 12;
        left = parseInt(el.css('left')) - 7;
        editor.css({top: top + 'px', left: left + 'px'});
    }
}

//显示通知
function showNotify() {
    $('.icon-notify')[App.Storage.get('hasChange') == '1' && !isInit ? 'show' : 'hide']();
}

//设置热区属性
function setHotspotProperty(item) {
    var text = $('#p_text'), link = $('#p_link');
    item.attr({title: text.val(), href: link.val()});
    updateCanvas();
}

//获取模版列表
function loadTpls() {
    $.ajax({
        type: "GET",
        url: App.Helper.url("p/jigsaw/load_tpls")
    }).done(function (data) {
            $('#tpl-list').html(data);
            $('#tpl-list a[data-id=' + canvasId + ']').addClass('current');
            if (isInit) {
                if (canvasJson != '' && canvasId != '') {
                    loadTpl();
                } else {
                    canvasId = '';
                    setCanvasProperty();
                }
            } else {
                updateCanvas();
            }
        });
}

//载入模版
function loadTpl(me) {
    var tpl, id;

    $('#tpl-list a').removeClass('current');

    if (me) {
        id = $(me).addClass('current').data('id');

        $.ajax({
            type: "GET",
            url: App.Helper.url('p/jigsaw/load_tpl'),
            data: {id: id }
        }).done(function (data) {
                canvasJson = data;
                tpl = JSON.parse(canvasJson);
                parseHotspot(tpl);
            });

    } else {
        tpl = JSON.parse(canvasJson);
        $('#tpl-list a[data-id=' + tpl.id + ']').addClass('current');
        parseHotspot(tpl);
    }
}

//更新画布
function updateCanvas() {
    var items = container.find('.item'),
        json = '',
        item = '';

    $('#canvas-name').val(canvasName);
    $('#canvas-width').val(canvasWidth);
    $('#canvas-height').val(canvasHeight);
    $('#canvas-bgcolor').val(canvasBgColor);

    canvas.css({'top': canvasTop + 'px', 'left': canvasLeft + 'px'});
    container.css({
        width: canvasWidth + 'px',
        height: canvasHeight + 'px',
        'background-color': canvasBgColor
    });

    items.each(function () {
        var it = $(this),
            img = it.find('img'),
            span = it.find('span'),
            text = span.html(),
            image = img.length > 0 ? img.attr('src').replace('/samgui/upload/', '') : '';

        item += ',{"top":' + parseFloat(it.css('top'))
            + ',"left":' + parseFloat(it.css('left'))
            + ',"width":' + parseFloat(it.css('width'))
            + ',"height":' + parseFloat(it.css('height'))
            + ',"image":"' + image
            + '","text":"' + text
            + '","color":"' + span.css('color')
            + '","font":"' + span.css('font')
            + '","bgcolor":"' + span.css('background-color')
            + '","align":"' + span.css('text-align')
            + '","index":' + it.css('z-index')
            + ',"href":"' + it.attr('href')
            + '","title":"' + it.attr('title')
            + '"}';
    });

    item = '[' + item.substring(1) + ']';

    if (canvasJson == '') {//新增
        canvasJson = '{"id":"' + canvasId
            + '","name":"' + canvasName
            + '","width":' + canvasWidth
            + ',"height":' + canvasHeight
            + ',"top":' + canvasTop
            + ',"left":' + canvasLeft
            + ',"bgcolor":"' + canvasBgColor
            + '","items":' + item + '}';
    } else {//更新
        json = JSON.parse(canvasJson);
        json.id = canvasId;
        json.name = canvasName;
        json.top = canvasTop;
        json.left = canvasLeft;
        json.width = canvasWidth;
        json.height = canvasHeight;
        json.bgcolor = canvasBgColor;
        json.items = JSON.parse(item);

        canvasJson = JSON.stringify(json);
    }

    App.Storage.set('canvasJson', canvasJson);
    //App.Storage.set('hasChange', (hasChange ? '0' : '1'));
    //showNotify();
    isInit = false;
}

//设置画布属性
function setCanvasProperty() {
    canvasTop = canvas.css('top').replace('px', '');
    canvasLeft = canvas.css('left').replace('px', '');

    canvasName = $('#canvas-name').val();
    canvasWidth = $('#canvas-width').val();
    canvasHeight = $('#canvas-height').val();
    canvasBgColor = '#fff';//$('#canvas-bgcolor').attr('value');
    updateCanvas();
}

/**
 * 调整属性
 * @param obj    节点对象
 * @param p      节点属性
 * @param step   递增/减步长
 */
function adjustHotspotProperty(obj, p, step) {
    var val;
    if (obj.length > 0) {
        val = parseFloat(obj.css(p));
        val = val + step;
        val = val < 0 ? 0 : val + 'px';
        obj.css(p, val);
    }
    updateCanvas();
}

//切换视图模式
function toggleViewMode() {
    var viewMode, label;

    if (body.hasClass('design-mode')) {
        viewMode = 'design-mode';
        label = '拼图';
        container.css('background-image', 'url(' + App.Storage.get('bg') + ')');
        disabled = false;
    } else {
        viewMode = '';
        propertyPanel.hide();
        container.css('background-image', 'none');
        label = '设计';
        disabled = true;
    }

    $('#btn-view-mode').find('span').html(label);
    container.find('.item').draggable("option", "disabled", disabled);
    App.Storage.set('viewMode', viewMode);
}

/**
 * 渲染图片
 * @param item  当前项
 * @param src   图片源路径(url|dataurl)
 */
function renderImage(item, src) {
    var img = item.find('img');

    if (img.length == 0) {
        img = $('<img src="' + src + '"/>');
        item.append(img);
    } else {
        img.attr('src', src);
    }

    img.load(function () {
        updateCanvas();
        bindImage(item, img);
    });
}

/**
 * 绑定图片
 * @param item  热区
 * @param img   图片
 */
function bindImage(item, img) {
    var w, h, wrapper;

    if (img.length > 0) {

        if (!item.hasClass('ui-has-image')) {
            item.addClass('ui-has-image');
        }

        w = img[0].width;
        h = img[0].height;

        img.resizable({
            handles: 'nw, ne, se, sw',
            aspectRatio: true
        });

        wrapper = img.parent('.ui-wrapper');
        $(img, wrapper).css({position: 'absolute', top: 0, left: 0, width: w + 'px', height: h + 'px'});
        wrapper.draggable();
    }
}

/**
 * * 构建热区
 * @param args
 * @returns {string}
 */
function buildHotspot(args) {
    var
        cssText,
        item = '',
        it = args.item,
        isGen = args.isGen,
        top = it.top == 0 ? 0 : it.top + 'px',
        left = it.left == 0 ? 0 : it.left + 'px',
        width = it.width == 0 ? 0 : it.width + 'px',
        height = it.height == 0 ? 0 : it.height + 'px',
        image = it.image ? '<img src="/samgui/upload/' + it.image + '" />' : '',
        text = it.text || '',
        color = it.color || '',
        font = it.font || '',
        bgcolor = it.bgcolor,
        align = it.align || '',
        index = it.index,
        href = it.href || 'http://',
        title = it.title || '',
        itemCls = $.trim(text) == '' ? (image == '' ? '' : ' ui-has-image') : ' ui-has-text';

    cssText = 'width:' + width + ';height:' + height + ';top:' + top + ';left:' + left + ';z-index:' + index;
    item += '<a href="' + href + '" data-index="' + index + '" class="item' + itemCls + '" style="' + cssText + '" ' + (isGen ? 'target="_blank"' : '') + ' title="' + title + '">';

    if (!isGen) {
        color = color == '' ? '' : 'color:' + color + ';';
        font = font == '' ? '' : 'font:' + font + ';';
        bgcolor = bgcolor == '' ? '' : 'background-color:' + bgcolor + ';';
        text = text == '' ? '' : text;
        align = align == '' ? '' : 'text-align:' + align + ';';
        item += '<span contenteditable="true" style="' +
            color + font + bgcolor + align + '">' + text + '</span>' + image;

        /*if (type == '1') {
         item += '<span style="background-color:' + bgcolor + ';">' +
         '<input class="w" value="' + parseFloat(width) + '" />x' +
         '<input class="h" value="' + parseFloat(height) + '" />' +
         '</span>';
         item += content;
         } else {
         color = color == '' ? '' : 'color:' + color + ';';
         font = font == '' ? '' : 'font:' + font + ';';
         bgcolor = bgcolor == '' ? '' : 'background-color:' + bgcolor + ';';
         content = content == '' ? '请输入文字' : content;
         align = align == '' ? '' : 'text-align:' + align + ';';
         item += '<span contenteditable="true" style="' + color + font + bgcolor + align + '">' + content + '</span>';
         }*/
    }

    item += '</a>';

    return item;
}

//创建热区
function newHotspot() {
    var items = container.find('.item'),
        item ,
        lastItem,
        newItem,
        id = 'item_' + (+new Date()),
        len = items.length,
        zIndex = 0,
        DEFAULT_WIDTH = 120,
        DEFAULT_HEIGHT = 120,
        MAX_WIDTH = canvasWidth,
        MAX_HEIGHT = canvasHeight,
        width = DEFAULT_WIDTH,
        height = DEFAULT_HEIGHT,
        top,
        left,
        bgcolor;

    //已包含热区单元则以最后一个热区为模版添加新热区
    if (len > 0) {
        lastItem = items.last();

        width = lastItem.outerWidth();
        height = lastItem.outerHeight();

        zIndex = parseInt(lastItem.css('z-index')) + 1;

        top = parseFloat(lastItem.css('top'));
        left = parseFloat(lastItem.css('left')) + width;

        //根据鼠标点击位置/按顺序添加
        top = Math.min(top, (MAX_HEIGHT - height));
        left = Math.min(left, (MAX_WIDTH - width));
    } else {
        top = Math.min(DEFAULT_HEIGHT * len, (MAX_HEIGHT - DEFAULT_HEIGHT));
        left = Math.min(DEFAULT_WIDTH * len, (MAX_WIDTH - DEFAULT_WIDTH));
    }

    bgcolor = App.Helper.rndColor();

    item = {
        top: top,
        left: left,
        width: width,
        height: height,
        index: zIndex,
        bgcolor: bgcolor
    };

    newItem = $(buildHotspot({item: item, isGen: false}));
    newItem.attr({'id': id}).appendTo(container);

    bindHotspot(newItem);
    updateCanvas();
}

//删除选中的热区
function deleteHostpost() {
    if (!disabled) {
        container.find('.current').remove();
        updateCanvas();
    }
}

/**
 * 绑定热区
 * @param item 热区
 */
function bindHotspot(item) {
    disabled = App.Storage.get('viewMode') == '';

    item
        .draggable({
            containment: "parent",
            disabled: disabled,
            snap: true,
            start: function (event, ui) {
                var me = ui.helper;
                me.addClass('on-drag');
            },
            stop: function (event, ui) {
                var me = ui.helper,
                    pos = ui.position,
                    top = pos.top,
                    left = pos.left,
                    width = me.width(),
                    height = me.height();

                if (top < 0) {
                    ui.helper.css('top', 0);
                }
                if (left < 0) {
                    ui.helper.css('left', 0);
                }
                if (top + height > canvasHeight) {
                    ui.helper.css('top', canvasHeight - height);
                }
                if (left + width > canvasWidth) {
                    ui.helper.css('left', canvasWidth - width);
                }
                me.removeClass('on-drag');
                updateCanvas();
            }
        })
        .resizable({
            containment: 'parent',
            handles: 'nw, ne, se, sw',
            disabled: disabled,
            start: function () {
                item.addClass('on-resize');
            },
            resize: function (event, ui) {
                updateCanvas();
            },
            stop: function () {
                item.removeClass('on-resize');
            }
        });

    item.bind('drop', function (e) {
        //设计状态下不允许热区拖图
        if (disabled && !item.hasClass('ui-has-text')) {
            var files = e.dataTransfer.files;

            e.stopPropagation();
            e.preventDefault();

            onUpload(item, files);
        } else {
            return false;
        }
    });

}

/**
 * 处理文件上传
 * @param item  当前热区
 * @param files 文件
 * @returns {boolean}
 */
function onUpload(item, files) {
    var len = files.length,
        file, type, reader;

    for (var i = 0; i < len; i++) {
        file = files[i];

        type = file.type
        reader = new FileReader();

        if (type.indexOf('image') == -1) {
            alert('请拖曳图片!');
            return false;
        }

        reader.onload = function () {
            App.Helper.ajaxUploader({
                url: App.Helper.url('uploader'),
                file: file,
                progress: function (e) {
                    if (e.lengthComputable) {
                        var percentage = Math.round((e.loaded * 100) / e.total);
                        showTip('已上传:' + percentage + '%', 'success');
                    }
                },
                load: function (e) {
                    var data = JSON.parse(e.target.responseText),
                        name = '/samgui/upload/' + data.name;

                    renderImage(item, name);
                }
            })
        };

        reader.readAsDataURL(file);
    }
}

/**
 * 解析热区数据
 * @param items 热区
 */
function parseHotspot(tpl) {
    var html = '';

    canvasId = tpl.id;
    canvasName = tpl.name;
    canvasTop = tpl.top;
    canvasLeft = tpl.left;
    canvasWidth = tpl.width;
    canvasHeight = tpl.height;
    canvasBgColor = tpl.bgcolor;

    $.each(tpl.items, function (index, value) {
        html += buildHotspot({item: value, isGen: false});
    });

    container.html(html).find('.item').each(function () {
        bindHotspot($(this));
    });

    updateCanvas();
}

//生成代码
function genCode() {
    var tpl = JSON.parse(canvasJson), html = '', tags = '';

    $.each(tpl.items, function (index, item) {
        //只需输出图片热区连接
        if (item.type == '1') {
            tags = buildHotspot({item: item, isGen: true});
            tags = $(tags).removeAttr('class').removeAttr('data-index');
            html += tags[0].outerHTML;
        }
    });

    html = html.replace(/</gi, '&lt;').replace(/</gi, '&gt;');

    html = $('#hota_canvas').html()
        .replace('{cssText}', 'width:' + tpl.width + 'px;height:' + tpl.height + 'px')
        .replace('{hotspot}', html)
        .replace('{img}', '&lt;!--设置图片路径--&gt;');

    $('#code-output').html($.trim(html));
    $('#code .label-success').html('');
}

