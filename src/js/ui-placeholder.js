/*
 * Copyright (c) 2012, Mttang Inc. All rights reserved.
 * @author: aNd1coder
 * @overview: 文本框占位插件
 * @usage: $("#txtSearch").placeholder()
 * @update: $Id: ui-placeholder.js 18180 2012-04-16 06:57:22Z guiyonghong $
 * - 去除特性检测,各浏览器一致
 */

(function ($) {

    $.fn.placeholder = function (options) {

        $.fn.placeholder.defaults = {
            initColor:"#d3d3d3", //初始颜色
            blurColor:"#d3d3d3", //失焦颜色
            focusColor:"#010101" //获焦颜色
        };

        var options = $.extend({}, $.fn.placeholder.defaults, options);

        this.each(function () {
            //正常状态下的颜色
            $(this).css("color", options.initColor);
        });

        this.each(function () {
            var $this = $(this), placeholder = $this.attr("placeholder");

            //如果没有设置value属性或者value为空,则设置value值为placeholder
            if (!this.value) {
                this.value = placeholder;
            }

            //聚焦以及失焦的状态改变
            $this.focus(
                function () {
                    if ($.trim(this.value) == placeholder) {
                        this.value = "";
                    }
                    this.style.color = options.focusColor;
                }).blur(function () {
                    if ($.trim(this.value) == "") {
                        this.value = placeholder;
                        this.style.color = options.blurColor;
                    }
                })
        });
    };
})(jQuery);