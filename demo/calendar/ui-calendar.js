/**
 *Copyright (c) 2012, Mttang Inc. All rights reserved.
 *@author    : aNd1coder
 *@usage     :
     var calendar = new Calendar({
     container:"j_calendar",
     labelSelectedDate:"j_selected_date",
     btnPrevMonth:"j_prev_month",
     btnNextMonth:"j_next_month",
     yearSelect:"j_year",
     btnPrevYear:"j_prev_year",
     btnNextYear:"j_next_year"
     });
 *@overview  : 基于原生js的日历控件
 *@update    : $Id$
 * -
 */

var Calendar = function (settings) {
    this.container = this.$get(settings.container);
    this.tbody = this.container.getElementsByTagName("tbody")[0];  //日期容器
    this.labelSelectedDate = this.$get(settings.labelSelectedDate); //显示当前日期
    this.curDayCls = settings.curDayCls || "current";  //当前日期样式
    this.btnPrevMonth = this.$get(settings.btnPrevMonth);//上一月触发元素
    this.btnNextMonth = this.$get(settings.btnNextMonth);//下一月触发元素
    this.btnPrevYear = this.$get(settings.btnPrevYear);//上一年触发元素
    this.btnNextYear = this.$get(settings.btnNextYear);//下一年触发元素
    this.curCellCls = settings.curCellCls || "ui-calendar-cell-current";
    this.disabledCellCls = settings.disabledCellCls || "ui-calendar-cell-disabled";
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.day = 0;
    this.init();//创建实例时自动初始化
};

Calendar.prototype = {
    constructor:Calendar,
    //获取元素
    $get:function (id) {
        var d = document;
        return (typeof id == "string") ? d.getElementById(id) : id;
    },
    //事件监听
    addEvent:function (el, event, fn) {
        if (el.addEventListener) { //W3C
            el.addEventListener(event, fn, false);
        } else if (el.attachEvent) { //IE
            el.attachEvent('on' + event, fn);
        } else {
            el['on' + event] = fn;
        }
    },
    //修复IE下tbody innerHTML只读问题
    setTbodyInnerHTML:function (tbody, html) {
        var temp = tbody.ownerDocument.createElement("div");
        temp.innerHTML = "<table>" + html + "</table>";
        tbody.parentNode.replaceChild(temp.firstChild.firstChild, tbody);
    },
    //初始化参数
    init:function () {
        var _this = this;
        this.render();

        this.addEvent(this.btnPrevMonth, "click", function () {
            _this.setMonth(-1);
        });

        this.addEvent(this.btnNextMonth, "click", function () {
            _this.setMonth(1);
        });

        this.addEvent(this.btnPrevYear, "click", function () {
            _this.setYear(-1);
        });

        this.addEvent(this.btnNextYear, "click", function () {
            _this.setYear(1);
        });

        var select = _this.$get("ui-calendar-select");
        this.addEvent(this.labelSelectedDate, "mouseover", function () {
            select.style.display = "block";
        });

        this.addEvent(select, "click", function (e) {
            var evt = e || window.event,
                target = evt.target || evt.srcElement;
            if (target.tagName.toUpperCase() == "A") {
                _this.year = target.innerHTML;
                _this.render();
            }
            select.style.display = "none";
        });

        //this.addEvent(select, "mouseout", function (e) {
        //    this.style.display = "none";
        //});

        //给单元格添加点击事件
        this.addEvent(this.tbody, "click", function (e) {
            var evt = e || window.event,
                target = evt.target || evt.srcElement;
            if (target.tagName.toUpperCase() == "A") {

                //去除所有单元格高亮样式
                var rows = _this.tbody.rows;
                for (var i = 0, len = rows.length; i < len; i++) {
                    var cells = _this.tbody.rows[i].cells;
                    for (var j = 0, len1 = cells.length; j < len1; j++) {
                        if (cells[j].className == this.curCellCls) {
                            cells[j].className = "";
                        }
                    }
                }
                //高亮当前单元格
                target.parentNode.className = this.curCellCls;
                _this.day = target.innerHTML;
                _this.setDateLabel();
            }
        });
    },
    //获得当前年月天数
    getDays:function () {
        return new Date(this.year, this.month, 0).getDate();
    },
    //获得上个月天数
    getDaysOfPrev:function () {
        return new Date(this.year, this.month - 1, 0).getDate();
    },
    //当月第一天是星期几
    firstDayOfWeek:function () {
        return new Date(this.year, this.month - 1, 1).getDay();
    },
    //格式化月和日
    format:function (d) {
        if (d < 10) {
            return "0" + d;
        } else {
            return d;
        }
    },
    //渲染日历
    render:function () {
        var htmlBuilder = '',
            i = 0,
            j = 0,
            cells,
            d = new Date(),
            now = d.getDate(),
            days = this.getDays(),
            prevDays = this.getDaysOfPrev(),
            start = this.firstDayOfWeek(),
            y = d.getFullYear(),
            m = d.getMonth() + 1;
        //填满开始日期前的格子
        htmlBuilder += '<tr>';
        start = start == 0 ? 7 : start;
        cells = 42 - (start + days);//剩余的格子
        while (i++ < start) {
            var prevday = prevDays - start + i;
            htmlBuilder += '<td class="' + this.disabledCellCls + '">' + prevday + '</td>';
        }
        if (start == 7) {//如果第一天为星期日则直接换行
            htmlBuilder += '</tr>';
        }

        //循环输出当月天数
        for (var day = 0; day < days; day++) {
            if (( day + i + 6 ) % 7 == 0) {
                htmlBuilder += "</tr><tr>";
            }

            if (y == this.year && m == this.month && (day + 1) == now) {
                htmlBuilder += '<td class="' + this.curCellCls + '"><a href="javascript:">' + ( day + 1 ) + '</a></td>';
            } else {
                htmlBuilder += '<td><a href="javascript:">' + (day + 1) + '</a></td>';
            }
            if (((days + start) > 35) && (( day + start + 1 ) == 35)) {
                htmlBuilder += '</tr><tr>';
            }
        }
        //输出剩下的格子
        while (j++ < cells) {
            if (( days + start + j - 1 ) == 35) {
                htmlBuilder += '</tr><tr>';
            }
            htmlBuilder += '<td class="' + this.disabledCellCls + '">' + j + '</td>';
        }
        htmlBuilder += "</tr>";
        //if (!-[1, ]) {//IE
        //    this.setTbodyInnerHTML(this.tbody, htmlBuilder);
        //} else {
        //    this.tbody.innerHTML = htmlBuilder;
        //}
        $(this.tbody).html(htmlBuilder);
        this.day = now;
        this.setDateLabel();
    },
    //设置时间标签为当前日期
    setDateLabel:function () {
        this.labelSelectedDate.innerHTML = this.year + '年' + this.format(this.month) + '月' + this.format(this.day) + '日';
    },
    //设置月份
    setMonth:function (m) {
        if (m == -1) {
            this.month--;
            if (this.month < 1) {
                this.month = 12;
                this.year--;
            }
        } else if (m == 1) {
            this.month++;
            if (this.month > 12) {
                this.month = 1;
                this.year++;
            }
        }
        this.render();
    },
    //设置年份
    setYear:function (y) {
        if (y == -1) {
            this.year--;
        } else if (y == 1) {
            this.year++;
        } else {
            this.year = y;
        }
        this.render();
    }
};