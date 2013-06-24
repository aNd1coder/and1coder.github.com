/*
 * Copyright (c) 2012, Mttang Inc. All rights reserved.
 * @author    : aNd1coder 
 * @usage     : $("#widget").fixedlay();
 * @overview  :  
 * @update    : $Id$
 * - 
 */

(function ($) {
    $.fn.fixedlay = function (options) {

        //defaults
        $.fn.fixedlay.defaults = {
            duration:200, //动画时间
            bottom:10     //距离窗口底部距离
        };

        //options
        var options = $.extend({}, $.fn.fixedlay.defaults, options);

        //logic
        var win = $(window),
            offset = win.height() - this.height() - 10;

        $(window).scroll(function () {
            var scrollPos;
            if (typeof window.pageYOffset != 'undefined') {
                scrollPos = window.pageYOffset;
            }
            else if (typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
                scrollPos = document.documentElement.scrollTop;
            }
            else if (typeof document.body != 'undefined') {
                scrollPos = document.body.scrollTop;
            }

            return this.each(function () {
                this.stop().animate({ "top":offset + scrollPos }, options.duration);
            })

        });
    };
})(jQuery);