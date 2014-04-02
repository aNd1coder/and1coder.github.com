/**
 *  @author     : aNd1coder
 *  @overview   : 分页组件
 *  @usage      : $("#new").paginator();
 *  @update     : $Id: paginator.js 16439 2014-03-26 05:10:09Z samgui $
 *  2012-07-31 提取回调函数名,选中和禁用样式类名到配置中,增加首页和尾页逻辑
 *  2012-10-13 调整命名规范
 *  2012-12-10 增加省略号逻辑
 *  2012-12-28 bugfix:总页码不足显示页码数时没有从第一页开始
 *  todo 增加省略页码和页码输入文本框
 */

(function ($) {
    $.fn.paginator = function (options) {

        //defaults
        $.fn.paginator.defaults = {
            container: ".ui_paginator",//分页容器
            total: 0,//总记录数
            pageIndex: 1,//当前页
            pageSize: 10,//页记录数
            showCount: 5,//显示页数
            curCls: "current",//当前样式
            disabledCls: "disabled",//禁用样式
            callback: "load",//回调函数名
            showInfo: false,
            showFirst: false,
            showPageNum: true,
            showLast: false
        };

        //options
        var options = $.extend({}, $.fn.paginator.defaults, options);

        this.each(function () {
            var render = "",
                total = options.total,
                pageIndex = options.pageIndex,
                pageSize = options.pageSize,
                pageCount = Math.ceil(total / pageSize),
                showCount = options.showCount,
                curCls = options.curCls,
                disabledCls = options.disabledCls,
                callback = options.callback;

            //分页信息
            if (options.showInfo) {
                render += '<span class="ui_paginator_info">' + options.showInfo + '</span>';
            }

            $(options.container)[total > pageSize ? 'show' : 'hide']();

            if (total < pageSize) {

            }

            //如果总页数大于1
            if (pageCount > 1) {
                //计算中间页码数字
                var _midNo = Math.ceil(showCount / 2),
                    _beginNo = pageIndex <= _midNo ? 1 : (pageIndex - _midNo + 1),
                    _endNo = _beginNo + showCount - 1;

                //结束页码不能大于总页码
                if (_endNo > pageCount || pageCount <= showCount + 1) {
                    _endNo = pageCount;
                }

                //保证一直有'显示页数'个页码
                if ((_endNo - _beginNo + 1) < showCount) {
                    _beginNo = _endNo + 1 - showCount;
                }

                _beginNo = _beginNo < 1 ? 1 : _beginNo;

                if (options.showFirst) {
                    //首页
                    if (pageCount > 1 && pageIndex != 1) {
                        render += '<a class="first" href="javascript:' + callback + '(' + 1 + ')">&lt;&lt;</a>';
                    } else {
                        render += '<a class="first ' + disabledCls + '" href="javascript:;">&lt;&lt;</a>';
                    }
                }

                //上一页
                if (pageIndex > _beginNo) {
                    render += '<a class="prev" href="javascript:' + callback + '(' + (pageIndex - 1) + ');">&lt;</a>';
                }
                else {
                    render += '<a class="prev ' + disabledCls + '" href="javascript:;">&lt;</a>';
                }

                //页码
                if (options.showPageNum) {
                    if (pageCount > showCount + 1 && pageIndex >= 4) {
                        render += '<a href="javascript:' + callback + '(1)">1</a>';
                        if (_beginNo > 2) {
                            render += '<a href="javascript:' + callback + '(2)">2</a>';
                        }
                        render += '<a class="disabled" href="javascript:;">...</a>';
                    }

                    for (var index = _beginNo; index <= _endNo; index++) {
                        if (index == pageIndex) {
                            render += '<a class="' + curCls + '" href="javascript:;">' + index + '</a>';
                        } else {
                            render += '<a href="javascript:' + callback + '(' + index + ')">' + index + '</a>';
                        }
                    }

                    if (pageCount > showCount && (pageCount - pageIndex > 2)) {
                        render += '<a class="disabled" href="javascript:;">...</a>';
                    }
                }

                //下一页
                if (pageIndex < _endNo) {
                    render += '<a class="next" href="javascript:' + callback + '(' + (pageIndex + 1) + ')">&gt;</a>';
                }
                else {
                    render += '<a class="next ' + disabledCls + '" href="javascript:;">&gt;</a>';
                }

                if (options.showLast) {
                    //尾页
                    if (pageCount > 1 && pageIndex != pageCount) {
                        render += '<a class="last" href="javascript:' + callback + '(' + pageCount + ')">&gt;&gt;</a>';
                    } else {
                        render += '<a class="last ' + disabledCls + '" href="javascript:;">&gt;&gt;</a>';
                    }
                }
            }
            $(this).html(render);
        })
    };
})(jQuery);