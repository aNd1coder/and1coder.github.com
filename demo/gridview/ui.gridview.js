/*
 Copyright (c) 2011, Mttang Inc. All rights reserved.
 @author: aNd1coder 
 @update: $Id: ui.gridview.js 18662 2012-04-24 06:21:20Z guiyonghong $
 @overview: 表头排序、隔行变色、鼠标掠过变色、选择表头列变色、分页、统计、固定表头、搜索、拖动列、拖动排序、隐藏列、全选/反选、右键菜单、双击弹层、嵌套折叠、新增航、刷新
 */
(function ($) {
    $.fn.gridview = function (options) {

        $.fn.gridview.defaults = {
            evenRowClass:"even",
            oddRowClass:"odd",
            activeRowClass:"active"
        };

        var options = $.extend({}, $.fn.gridview.defaults, options);

        this.each(function () {
            var $this = $(this), $tr = $this.find("tbody>tr");
            //添加奇偶行颜色
            //$(this).find("tbody>tr:even").addClass(options.evenRowClass);
            //$(this).find("tbody>tr:odd").addClass(options.oddRowClass);

            $tr.bind("hover",
                function () {
                    $(this).toggleClass(options.activeRowClass);
                },
                function () {
                    $(this).toggleClass(options.activeRowClass);
                }).bind("click", function () {
                    var self = $(this),
                        ck = self.find("input[type='checkbox']")[0];
                    self.toggleClass(options.activeRowClass);
                    ck.checked = !ck.checked;
                });
        });
    };
})(jQuery);