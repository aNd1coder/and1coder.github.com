/*
 Copyright (c) 2011, Mttang Inc. All rights reserved.
 @author: aNd1coder 
 @update: $Id: ui-gridview.js 15802 2012-01-12 07:16:58Z guiyonghong $
 @overview: 表头排序、隔行变色、鼠标掠过变色、选择表头列变色、分页、统计、固定表头、搜索、拖动列、拖动排序、隐藏列、全选/反选、右键菜单、双击弹层、嵌套折叠
 */
(function($) {
    $.fn.ui.gridview = function(options) {
        var defaults = {
            evenRowClass:"evenRow",
            oddRowClass:"oddRow",
            activeRowClass:"activeRow"
        }
        var options = $.extend(defaults, options);
        this.each(function() {
            var thisTable = $(this);
            //添加奇偶行颜色
            $(thisTable).find("tr:even").addClass(options.evenRowClass);
            $(thisTable).find("tr:odd").addClass(options.oddRowClass);
            //添加活动行颜色
            $(thisTable).find("tr").bind("mouseover", function() {
                $(this).addClass(options.activeRowClass);
            });
            $(thisTable).find("tr").bind("mouseout", function() {
                $(this).removeClass(options.activeRowClass);
            });
        });
    };
})(jQuery);