---
layout: post
title: ajax请求在ie下返回undefined
categories: 前端开发
tags: [Javascript, ajax, Json]
---
再次遇到此问题，之前由于后端php输入json时没有统一指定contentType头导致一些特殊场合采坑，今天在重构弹层逻辑的时候又踩到了，虽然很快解决了，但是还是记录下作为备案。项目前期时间比较赶，页面所有弹层的view片段直接通过php load到主view，感觉非常浪费，于是把artDialog5.0.1进行了再包装，增加了ajax请求内容，由于是html片段前后端没有指定编码导致ie下实际返回了内容但是success回调函数得到undefined。解决方案就是ajax请求以及后端response的时候都指定contentType头

javascript:

	$.ajax({
	      url:'',
	      type:'GET',
	      cache:false,
	      contentType:'text/html; charset=utf-8;', //统一前后端编码为utf-8防止ie下返回undefined
	      success:function (result) {}
	});

php:

	header("Content-Type: text/html; charset=utf-8;");