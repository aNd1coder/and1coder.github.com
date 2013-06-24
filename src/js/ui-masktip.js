/*
 * Copyright (c) 2012, Mttang Inc. All rights reserved.
 * @author: aNd1coder
 * @overview:淡入淡出的透明提示层
 * @usage:
 * @update: $Id: ui-masktip.js 16637 2012-03-01 09:06:13Z guiyonghong $
 * @todo:补全动画从各个方向出现的逻辑
 */

(function ($) {
    $.fn.masktip = function (options) {

        //defaults
        $.fn.masktip.defaults = {
            maskClass:".ui-masktip", //提示层类名
            fadeIn:500, //淡入时间间隔
            fadeOut:500, //淡出时间间隔
            size:30, // 提示层偏移量(高度或宽度)
            direction:"bottom"//出现方向
        };

        //extend
        var options = $.extend({}, $.fn.masktip.defaults, options);

        //logics
        //this.each(function () {
        //    var $this = $(this), $mask, maskClass = options.maskClass;
        //    $this.hover(function () {
        //        var $this = $(this), $title = $this.find("a").attr("rel");
        //        if ($.trim($title) != "") {
        //            var $width = $this.width() + "px", $attrs , $mask, $attr;
        //            //出现方向为top或bottom则递增height,反之则为width
        //            if (options.direction == "top" || options.direction == "right") {
        //                $attr = "width";
        //                $attrs = "top:0;right:0;";
        //            } else {
        //                $attr = "height";
        //                $attrs = "bottom:0;left:0;";
        //            }
        //            $mask = $("<p class='" + maskClass.substring(1) + "' style='width:" + $width + ";" + $attrs + "'>" + $title + "</p>");
        //            $this.css({"position":"relative"}).append($mask);
        //            $mask.animate({$attr:'+' + options.size + 'px'}, options.fadeIn);
        //        }
        //    }, function () {
        //        var $mask = $(this).find(maskClass);
        //        $mask.fadeOut(options.fadeOut, function () {
        //            $mask.remove();
        //        });
        //    })
        //})
        this.each(function () {
            var $this = $(this), maskClass = options.maskClass;
            $this.hover(function () {
                var width = $this.width() + "px", title = $this.attr("rel");
                if ($.trim(title) != "") {
                    var $attrs , $mask;
                    if ($this.has(maskClass)) {  //清理历史节点
                        $(this).find(maskClass).remove();
                    }
                    $mask = $("<p class='" + maskClass.substring(1) + "' style='width:" + width + ";" + $attrs + "'>" + title + "</p>");
                    $this.css({"position":"relative"}).append($mask);
                    $(this).find(maskClass);
                    $mask.animate({height:'' + options.size + 'px'}, options.fadeIn);
                }
            }, function () {
                var $mask = $(this).find(maskClass);
                $mask.fadeOut(options.fadeOut, function () {
                    $mask.remove();
                });
            })
        })
    };
})(jQuery);