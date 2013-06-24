/**
 *Copyright (c) 2012, Mttang Inc. All rights reserved.
 *@author    : aNd1coder
 *@usage     : $("#widget").Draggable();
 *@overview  : 拖放类
 *@update    : $Id$
 * -
 */

var Draggable = function (settings) {
    this.drag = this.$getEl(settings.drag);//触发对象
    this.wrapper = this.$getEl(settings.wrapper);//拖放对象
    this.init();
};

Draggable.prototype = {
    $getEl:function (id) {
        return "string" === typeof id ? document.getElementById(id) : id;
    },
    bind:function (object, fn) {
        return function () {
            fn.apply(object, arguments);
        }
    },
    bindAsEventListener:function (object, fn) {
        return function (event) {
            return fn.call(object, (event || window.event));
        }
    },
    addEventHandler:function (el, evtType, fn) {
        if (el.addEventListener) {
            el.addEventListener(evtType, fn, false);
        } else if (el.attachEvent) {
            el.attachEvent("on" + evtType, fn);
        } else {
            el["on" + evtType] = fn;
        }
    },
    removeEventHandler:function (el, evtType, fn) {
        if (el.removeEventListener) {
            el.removeEventListener(evtType, fn, false);
        } else if (el.detachEvent) {
            el.detachEvent("on" + evtType, fn);
        } else {
            el["on" + evtType] = null;
        }
    },
    init:function () {
        this._x = this._y = 0;//拖放目标坐标
        this.fnMove = this.bindAsEventListener(this.drag, this.move);
        this.fnStop = this.bind(this.drag, this.stop);
        this.wrapper.style.position = "absolute";
        this.addEventHandler(this.drag, "mousedown", this.bindAsEventListener(this.drag, this.start));
        console.log("drag init");
    },
    //开始拖动
    start:function (oEvent) {
        this._x = oEvent.clientX - this.drag.offsetLeft;
        this._y = oEvent.clientY - this.drag.offsetTop;
        this.addEventHandler(document, "mousemove", this.fnMove);
        this.addEventHandler(document, "mouseup", this.fnStop);
        console.log("drag start");
    },
    //拖动中
    move:function (oEvent) {
        this.wrapper.style.left = oEvent.clientX - this._x + "px";
        this.wrapper.style.top = oEvent.clientY - this._y + "px";
        console.log("drag move x:" + ( oEvent.clientX - this._x) + ",y:" + (oEvent.clientY - this._y));
    },
    //拖动结束
    stop:function () {
        this.removeEventHandler(document, "mousemove", this.fnMove);
        this.removeEventHandler(document, "mouseup", this.fnStop);
        console.log("drag stop");
    }
}