/*
	Copyright (c) 2011, Mttang Inc. All rights reserved.
	author: zhangwang 
	update: $Id: ui-returntop.js 17012 2012-03-19 07:57:15Z zhangwang $
*/
function ReturnTop(){
	
}
ReturnTop.prototype = {
	config : function (config){
		var options = {
			img : 'http://static.mttang.com/p/7366/v1/img/return.gif',
			top : 220,
			right : 190,
			height : 98,
			width : 28
		};
		return $.extend(options,config);
	},
	buildTree : function(options){
		var htmlStr = "height:" + options["height"] + "px;width:" + options["width"] + "px;top:" + options["top"] + "px;right:" + options["right"] + "px";
		htmlStr = "<div class='scroll-toolbar' style='position:fixed;display:none;" + htmlStr + "'><a href='#' title='返回顶部'><img src='" + options.img + "' alt='返回顶部' /></a></div>";
		$(document.body).append(htmlStr);
	},
	assoEvent : function(){
		$(window).scroll(function(){
			if ($(window).scrollTop() > 0) {
				$(".scroll-toolbar").show();
			} else {
				$(".scroll-toolbar").hide();
			}
		});
	},
	init : function(options){
		options = this.config(options);
		this.buildTree(options);
		this.assoEvent();
	}
};