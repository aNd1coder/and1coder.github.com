/*
 *Copyright (c) 2012, Mttang Inc. All rights reserved.
 *@author   : aNd1coder
 *@usage    : $("#slide").slide();
 *@overview : 幻灯片组件
 *@update   : $Id: ui-slide.js 16537 2012-02-29 10:11:26Z guiyonghong $
 *          - 2012-02-29 修复节点获取范围问题
 *                       增加动画方向参数,支持水平和垂直方向滚动
 *                       增加是否显示标题参数,重构showItems方法
 */

(function ($) {
    $.fn.slide = function (options) {

        //defaults
        $.fn.slide.defaults = {
            "triggers":".ui-slide-trigger", //触发点容器
            "container":".ui-slide-container", //内容容器
            "current":"current", //当前触发点以及对应内容节点样式
            "event":"mouseenter", //触发点触发事件类型
            "direction":"horizontal", //滚动方向,默认水平,可选:( horizontal|vertical )
            "selectedIndex":0, //默认被选中的索引
            "auto":true, //是否自动切换
            "interval":2000, //时间间隔
            "showtitle":true //是否显示标题,默认显示
        };

        //options
        var options = $.extend({}, $.fn.slide.defaults, options);

        //logics
        this.each(function () {
            var $this = $(this),
                iWidth = $this.width(), //获取焦点图的宽度（显示面积）
                iHeight = $this.height(), //获取焦点图的高度（显示面积）
                $container = $this.find(options.container),
                isVertical = options.direction == "vertical",
                $ul = $container.find("ul"),
                $trigger = $this.find(options.triggers),
                $triggers = $trigger.find(".item"),
                len = $triggers.length, //获取焦点图个数
                index = 0,
                oTimer;

            //为数字按钮添加鼠标滑入事件，以显示相应的内容
            $triggers.bind(options.event,
                function () {
                    index = $triggers.index(this);
                    showItems(index);
                }).eq(0).trigger(options.event);

            //滚动方向,默认为左右滚动，即所有li元素都是在同一排向左浮动，所以这里需要计算出外围ul元素的宽度
            if (!isVertical) {
                $ul.css("width", iWidth * (len + 1));
            } else {
                $ul.css("height", iHeight * (len + 1));
            }

            //鼠标滑上焦点图时停止自动播放，滑出时开始自动播放
            if (options.auto) {
                $this.hover(
                    function () {
                        clearInterval(oTimer);
                    },
                    function () {
                        autoPlay();
                    }).trigger("mouseleave");
            }

            //显示图片函数，根据接收的index值显示相应的内容
            function showItems(index, bFirst) {
                var iOffset, iIndex;
                if (bFirst) { //最后一张图自动切换到第一张图
                    $ul.append($ul.find("li:first").clone());
                }
                if (!isVertical) {
                    iOffset = -index * iWidth; //根据index值计算ul元素的left值
                    $ul.stop(true, false).animate({ "left":iOffset }, 500, function () {
                        if (bFirst) {
                            //通过callback，在动画结束后把ul元素重新定位到起点，然后删除最后一个复制过去的元素
                            $ul.css("left", "0");
                            $ul.find("li:last").remove();
                        }
                        showTitle();
                    }); //通过animate()调整ul元素滚动到计算出的position
                } else {
                    iOffset = -index * iHeight; //根据index值计算ul元素的top值
                    $ul.stop(true, false).animate({ "top":iOffset }, 500, function () {
                        if (bFirst) {
                            $ul.css("top", "0");
                            $ul.find("li:last").remove();
                        }
                        showTitle();
                    }); //通过animate()调整ul元素滚动到计算出的position
                }
                iIndex = bFirst ? 0 : index;
                $triggers.removeClass(options.current).eq(iIndex).addClass(options.current); //当前触发点切换到选中的效果
            }

            //自动播放
            function autoPlay() {
                oTimer = setInterval(function () {
                    if (index == len) { //如果索引值等于li元素个数，说明最后一张图播放完毕，接下来要显示第一张图，即调用showFirstItem()，然后将索引值清零
                        showItems(index, true);
                        index = 0;
                    } else { //如果索引值不等于li元素个数，按普通状态切换，调用showItems()
                        showItems(index, false);
                    }
                    index++;
                }, 3000); //此3000代表自动播放的间隔，单位：毫秒
            }

            //是否显示标题
            function showTitle() {
                if (options.showtitle) {
                    var iIndex = index - 1, title = $container.find("a").eq(iIndex).attr("title") ||
                        $container.find("img").eq(iIndex).attr("title") ||
                        $container.find("img").eq(iIndex).attr("alt");
                    if ($.trim(title) != "") { 
                        $trigger.find("span").html(title);
                    }
                }
            }
        })
    };
})(jQuery);
