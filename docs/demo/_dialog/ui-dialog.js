/*
 * Copyright (c) 2012, Mttang Inc. All rights reserved.
 * @author    : aNd1coder 
 * @usage     : $("#widget").dialog();
 * @overview  : 对话框,带遮罩,屏幕固定居中,可拖放,最大化,最小化
 * @update    : $Id$
 * - 
 */

(function ($) {
    $.fn.dialog = function (options) {

        //defaults
        $.fn.dialog.defaults = {
            id:"dialog_" + (+new Date()), //弹窗id
            title:"dialog title", //标题
            width:"auto", //宽度
            height:"auto", //高度
            overlay:true, //显示遮罩层
            fixed:true, //屏幕固定
            center:true, //居中
            maximize:true, //显示最大化
            minimize:true, //显示最小化
            close:true, //显示关闭
            draggable:true, //可拖放
            zIndex:999, //z-index
            handle:"", //拖放触发对象,当draggable为true时有效
            onStart:null, //开始拖放执行事件
            onMove:null, //拖放中执行事件
            onStop:null  //结束拖放执行事件
        };

        //options
        var options = $.extend({}, $.fn.dialog.defaults, options),
            ie = $.browser.msie,
            ie6 = (ie && $.browser.version == "6.0"),
            _x = 0, _y = 0;//拖放目标坐标

        this.each(function () {
            //渲染灯箱
            lightbox();

            var $this = $(this) ,
                wrapper = $("#" + options.id + ""),
                drag = wrapper.find("#ui-dialog-header");

            wrapper.find(".ui-dialog-container").css({"width":options.width + "px", "height":options.height - drag.height() - 10 + "px"}).append($this);

            if (options.overlay) {
                overlay();
                //拖动滚动和缩放窗口时修正遮罩层的宽高
                window.onresize = window.onscroll = function () {
                    overlay();
                };
            }

            if (options.draggable) {
                draggable(drag, wrapper);
            }
        });

        //灯箱
        function lightbox() {
            var render = "",
                width = options.width,
                height = options.height,
                position = options.fixed && !ie6 ? "fixed" : "absolute";

            render += "<div class=\"ui-dialog-wrapper\" id=\"" + options.id + "\">";
            render += "<table class=\"ui-dialog-layout\"><tbody><tr><td class=\"ui-dialog-hdleft\"></td><td class=\"ui-dialog-hdcenter\"></td><td class=\"ui-dialog-hdright\"></td></tr><tr><td class=\"ui-dialog-bdleft\"></td><td class=\"ui-dialog-bdcenter\">";
            render += "<div class=\"ui-dialog\">";
            render += "   <div id=\"ui-dialog-header\" class=\"ui-dialog-header\">";
            render += "      <span id=\"ui-dialog-title\" class=\"ui-dialog-title\">" + options.title + "</span>";
            render += "      <div class=\"ui-dialog-action\">";
            //窗体操作
            if (options.minimize) {
                render += "          <a href=\"###\" class=\"ui-button ui-button-min\" title=\"最小化\"></a>";
            }
            if (options.maximize) {
                render += "          <a href=\"###\" class=\"ui-button ui-button-max\" title=\"最大化\"></a>";
            }
            if (options.close) {
                render += "          <a href=\"###\" class=\"ui-button ui-button-close\" title=\"关闭\"></a>";
            }
            render += "      </div>";
            render += "   </div>";
            render += "   <div class=\"ui-dialog-container\">";
            render += "   </div>";
            render += "   <div class=\"ui-dialog-footer\"></div>";
            render += "</div> ";
            render += "</td><td class=\"ui-dialog-bdright\"></td></tr><tr><td class=\"ui-dialog-ftleft\"></td><td class=\"ui-dialog-ftcenter\"></td><td class=\"ui-dialog-ftright\"></td></tr></tbody></table></div>";

            $(document.body).append(render);

            var wrapper = $("#" + options.id + "");

            wrapper.css({"position":position, "width":width + "px", "height":height + "px", "z-index":options.zIndex });

            if (options.center) {
                fixcenter(wrapper, width, height);
            }

            $(".ui-button-min").click(function () {
                wrapper.hide();
                $(".ui-overlay").hide();
            });

            $(".ui-button-max").click(function () {
                if (wrapper.attr("data-appmax") == "0") {
                    var w = (document.documentElement.clientWidth - 20) + "px", h = (document.documentElement.clientHeight - 20) + "px";
                    wrapper.css({"left":"0px", "top":"0px", "margin":"0", "width":w, "height":h});
                    wrapper.addClass("ui-dialog-max").attr("data-appmax", "1");
                }
            });

            $(".ui-button-close").click(function () {
                wrapper.remove();
                $(".ui-overlay").remove();
            });
        }

        //遮罩层
        function overlay() {
            if ($(".ui-overlay").length == 0) {
                $(document.body).append("<div class=\"ui-overlay\"><!--[if lte IE 6]><iframe src=\"javascript:false;\" width=\"100%\" height=\"100%\" style=\"filter:alpha(opacity='0');\" scrolling=\"no\"></iframe><![endif]--></div>");
            }
            var d = document.documentElement;
            var sh = Math.max(d.scrollHeight, d.clientHeight) + "px";
            var sw = Math.max(d.scrollWidth, d.clientWidth) + "px";
            $(".ui-overlay").css({"width":sw, "height":sh, "z-index":options.zIndex - 1 });
        }

        //弹出层屏幕居中
        function fixcenter(wrapper, width, height) {
            var top = -width / 2 + "px", left = -height / 2 + "px";
            wrapper.css({"top":"50%", "left":"50%", "margin":top + " 0 0 " + left});
        }

        //重置位置
        function resetposition(wrapper) {
            wrapper.css({"top":"auto", "left":"auto", "margin":"auto"});
        }

        //拖放
        function draggable(drag, wrapper) {
            wrapper.css({"position":"absolute"});
            $(drag).bind("mousedown", function (oEvent) {
                _x = document.documentElement.scrollLeft + oEvent.clientX - drag.offset().left;
                _y = document.documentElement.scrollTop + oEvent.clientY - drag.offset().top;

                $(document).bind("mousemove", move).bind("mouseup", stop);

                if (ie) {
                    //焦点丢失
                    drag.bind("losecapture", stop);
                    drag[0].setCapture();
                } else {
                    //焦点丢失
                    $(window).bind("blur", stop);
                    //阻止默认动作
                    oEvent.preventDefault();
                }
            });

            //开始拖放回调函数
            if (options.onStart) {
                options.onStart();
            }
        }

        //拖动
        function move(oEvent) {
            //清除选择
            window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();

            var wrapper = $("#" + options.id + "");

            var iLeft = document.documentElement.scrollLeft + oEvent.clientX - _x + "px",
                iTop = document.documentElement.scrollTop + oEvent.clientY - _y + "px";

            wrapper.css({"left":iLeft, "top":iTop});

            //拖放中回调函数
            if (options.onMove) {
                options.onMove();
            }
        }

        //停止拖动
        function stop(evt) {
            var e = evt || window.event,
                drag = e.srcElement || e.target;//获得拖放对象

            $(document).stop().unbind("mousemove").unbind("mouseup");
            if (ie) {
                //焦点丢失
                $(drag).unbind("losecapture", stop);
                drag.releaseCapture();
            } else {
                //焦点丢失
                $(window).bind("blur", stop);
            }

            //结束拖放回调函数
            if (options.onStop) {
                options.onStop();
            }
        }
    };
})(jQuery);