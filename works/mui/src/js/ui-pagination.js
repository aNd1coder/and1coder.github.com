/*
 *Copyright (c) 2011, Mttang Inc. All rights reserved.
 *@author: aNd1coder
 *@overview: 分页组件
 *@usage: $("#new").paging();
 *@update: $Id: ui-pagination.js 16636 2012-03-01 09:03:01Z guiyonghong $
 */

(function ($) {
    $.fn.paging = function (options) {

        $.fn.paging.defaults = {
            "container":".ui-paging", //分页容器
            "total":0, //总记录数
            "pageindex":1, //当前页
            "pagesize":20, //页记录数
            "showcount":11, //显示页数
            "callback":"" //点击页码执行的事件名称,一般为接受当前页码的加载为参数的加载数据函数
        };

        var options = $.extend({}, $.fn.paging.defaults, options);

        this.each(function () {
            var render = "",
                pagecount = Math.ceil(options.total / options.pagesize),
                pageindex = options.pageindex,
                pagesize = options.pagesize,
                showcount = options.showcount,
                callback = options.callback;
            //如果总页数大于1
            if (pagecount > 1 && callback != "") {
                //计算中间页码数字           
                var midno = Math.ceil(options.showcount / 2);
                var beginno = pageindex <= midno ? 1 : pageindex - midno + 1;
                var endno = beginno + showcount - 1;
                if (endno > pagecount) {
                    endno = pagecount;
                }

                render += "<span>每页显示" + pagesize + "条 / 共" + pagecount + "页</span>";

                //上一页
                //如果有上一页             
                if (pageindex > beginno) {
                    render += "<a class=\"prev\" href=\"javascript:" + callback + "(" + (pageindex - 1) + ")\">上一页</a>";
                }
                else {
                    render += "<a class=\"prev\" href=\"javascript:\">上一页</a>";
                }

                //循环页码
                for (var index = beginno; index <= endno; index++) {
                    if (index == pageindex) {
                        render += "<a class=\"hover\" href=\"javascript:" + callback + "(" + index + ")\">" + index + "</a>";
                    }
                    else {
                        render += "<a href=\"javascript:" + callback + "(" + index + ")\">" + index + "</a>";
                    }
                }

                //下一页             
                if (pageindex < endno) {
                    render += "<a class=\"next\" href=\"javascript:" + callback + "(" + (pageindex + 1) + ")\">下一页</a>";
                }
                else {
                    render += "<a class=\"next\" href=\"javascript:;\">下一页</a>";
                }

                $(options.container).html(render);
            }
        })
    };
})(jQuery);