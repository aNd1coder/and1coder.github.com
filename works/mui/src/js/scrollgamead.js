var m_pop_Ad = (function(){
	var space,clock,config;
	/**
	 * @function 关闭弹出层
	 */
	function intract(){
		clearInterval(space);
		clearTimeout(clock);
		$('#scroll').animate({
			bottom:'-200px'
		},1000,function(){
			$('#scroll').css('bottom','-200px');
			$('#scroll').css('display','none');
			setInval();
		});
	}
	/**
	 * @function 设置间隔多少分钟弹出一次
	 */
	function setInval(){
		space = setInterval(function(){
			animate();
		},config['space']);
	}
	/**
	 * @function 弹出到关闭动画的过程
	 */
	function animate(){
		clearInterval(space);
		clearTimeout(clock);
		$('#scroll').show().css({'display':'block','bottom':'-200px'});
		$('#scroll').animate({
			bottom:"0px"
		}, 1000 ,function(){
			clock = setTimeout(function(){
				$('#scroll').animate({
					bottom:'-200px'
				},1000,function(){
					$('#scroll').css('bottom','-200px');
					$('#scroll').css('display','none');
					setInval();
				});
			},config['close']);
		});
	}
	/**
	 * @function 随即选择一个弹出层框
	 */
	function random(){
		var rand = Math.round(Math.random()*6),color;
		switch (rand) {
			case 0 :color = 'blue';break;
			case 1 :color = 'green';break;
			case 2 :color = 'purple';break;
			case 3 :color = 'black';break;
			case 4 :color = 'yellow';break;
			case 5 :color = 'orange';break;
			case 6 :color = 'cyan';break;
		}
		return color;
	}
	/**
	 * @function 生成静态HTMl，内嵌游戏中
	 */
	function initHTML(){
		var href = location.href,htmls;
		if(href.indexOf('mttang.com') != -1){
			href = 'http://www.mttang.com/ingame/' + random() + '.html';
			document.domain = 'mttang.com';
		} else if (href.indexOf('7366.com') != -1) {
			href = 'http://www.7366.com/ingame/' + random() + '.html';
			document.domain = '7366.com';
		} else {
			href = 'game/' + random() + '.html';
		}
		htmls = "<div class='stip_pop' id='scroll' style='display:none'>                                                                                                                                              "+
				"	<iframe id='poper' name='poper' align='left'  height='100%' width='100%' scrolling='no' frameborder='0'  marginheight='0' marginwidth='0' src='" + href + "'></iframe>       "+
				"</div>                                                                                                                                                                          ";
		$(document.body).append(htmls);
	}
	/**
	 * @function 初始化方法
	 */
	function init(cg,params){
		setConfig(cg);
		if (config['on']) {
			$(function(){
				initHTML();
				setParams(params);
				setTimeout(function(){//等待多少秒
					$('#scroll').show();
					animate();
				},config['first']);
			});
		}
	}
	/**
	 * @function 设置参数配置信息
	 */
	function setConfig(cg) {
		config = cg || {};
		if (!('space' in config)) {
			config['space'] = 60 * 30 * 1000;
		}
		if (!('on' in config)) {
			config['on'] = true;
		}
		if (!('first' in config)) {
			config['first'] = 10 * 1000;
		}
		if (!('close' in config)) {
			config['close'] = 30 * 1000;
		}
	}
	/**
	 * @function 初始化子页面的参数配置信息
	 */
	function setParams(params) {
		var win;
		try{
			win = document.getElementById('poper').contentWindow || window.frames['poper'];
		}catch(e){
			alert(e);
		}
		setTimeout(function(){
			win.init(params);
		},1000);
	}
	return {
		init : init,//初始化接口
		intract : intract//给子页面调用接口
	};
})();