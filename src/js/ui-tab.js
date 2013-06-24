/*
 *Copyright (c) 2011, Mttang Inc. All rights reserved.
 *@author: aNd1coder
 *@overview: 选项卡组件
 *@usage: $("#new").tab();
 *@update: $Id: ui-tab.js 16572 2012-03-01 05:47:13Z guiyonghong $
 */

(function($) {
    $.fn.tab = function(options) {

        $.fn.tab.defaults = {
            "trigger":".ui-tab-trigger", //触发点容器
            "container":".ui-tab-container", //内容容器
            "current":"current", //当前触发点以及内容节点样式
            "event":"mouseover", //触发事件类型
            "selectedIndex":0, //默认被选中的索引
            "auto":false, //是否自动切换
            "interval":2000, //时间间隔
            "lazyload":true //是否延迟加载
        };

        var options = $.extend({}, $.fn.tab.defaults, options);

        this.each(function() {
            var $tab = $(this),
                $triggerItems = $tab.find(options.trigger + " .item"),
                $containerItems = $tab.find(options.container + " .item"),
                currentClass = options.current,
                selectedIndex = options.selectedIndex;

            //设置默认选中
            $triggerItems.eq(selectedIndex).addClass(currentClass);
            $containerItems.eq(selectedIndex).addClass(currentClass);

            $triggerItems.each(function() {
                var $triggerItem = $(this), tabIndex = $triggerItems.index($triggerItem), $containerItem = $containerItems.eq(tabIndex);
                $triggerItem.bind(options.event, function() {
                    $triggerItems.removeClass(currentClass);
                    $containerItems.removeClass(currentClass);
                    $triggerItem.addClass(currentClass);
                    $containerItem.addClass(currentClass);
                    selectedIndex = tabIndex;
                })
            })

            if (options.auto && options.interval) { //必须同时设置auto以及interval参数才进行自动切换
                var interval = options.interval, itemCount = $triggerItems.length;
                setInterval(function () {
                    $triggerItems.eq(selectedIndex).trigger(options.event);
                    selectedIndex++;
                    if (selectedIndex == itemCount) {
                        selectedIndex = 0;
                    }
                }, interval);
            }
        })
    };
})(jQuery);