/**
 * @author : 张旺
 * @function ： 图片上下左右滚动
 * @fileOverview ：基于Jquery库写的,图片上下左右滚动,多单位(高、宽)窗口滚动滚多图片,还需要继续升级的是,横向窗口,竖向滚动,竖向窗口,横向滚动.
 * @description ：设计思路:左右方向合并控制'left',上下合并控制'top';具体过程:经过参数验证,异常抛出;生成节点树结构;初始化内部配置信息参数;初始化运行函数;细节计算函数;
 * @example ：向左滚动实例
  mulscrollimage({
		width : 206,
		height : 145,
		imgs : "http://static.mttang.com/p/js/v2/img/job1.jpg,http://static.mttang.com/p/js/v2/img/job2.jpg,http://static.mttang.com/p/js/v2/img/job3.jpg,http://static.mttang.com/p/js/v2/img/job4.jpg,http://static.mttang.com/p/js/v2/img/job5.jpg,http://static.mttang.com/p/js/v2/img/job6.jpg" ,
		links : "http://js.mttang.com/v2/emei.html,http://js.mttang.com/v2/mingjiao.html,http://js.mttang.com/v2/huashan.html,http://js.mttang.com/v2/jinyiwei.html,http://js.mttang.com/v2/wudang.html,http://js.mttang.com/v2/shaolin.html"
	},{
		direction : "left",
		per : 103,
		num : 6,
		size : 2,
		move : 1,
		delay : 2000,
		clock : 100,
		callback : function (node,count){
			return parseInt(node.css('left')) - 20;
		}
	});
 * @link ：
 * @version ：Mttang-1.1.0
 * @throws : 图片数量以及图片滚动单位异常
 * 
 * 	本地需要覆盖的css
  	.mt-scroll-mask{width:206px;height:145px;}遮罩层
 	.mt-scroll-mask li{height:145px;width:103px;}节点
 	.mt-scroll-container{width:32768px;}容器层
 * 
 * 
 */
var mulscrollimage = (function($){
	/**
	 * @function ： 图片功能运行函数
	 * @description ：对外提供一个,图片功能运行函数
	 * @param  conf	 运行时配置信息
	 * @param  func	 生成节点回调函数
	 * @return 图片功能运行函数
	 */
	return function(conf,callobj){
		/**
		 * @private 
		 */
		var clock,//每次运行interval引用
		delay,//每次运行timeout引用
		count = 1,//节点统计器
		sImg,//遮罩层
		items,//li节点集
		mask = {},
		config = {};//内配置对象
		var scrollImg = {
			/**
			 * @function： 检查分解函数
			 * @description：检查分解函数
			 */
			checkAndSplit : function() {
				var direct = {
					top : 'top',
					bottom : 'top',
					left : 'left',
					right : 'left'
				}
				config.direction = conf.direction ? conf.direction : 'left';//运行方向
				config.callback = conf.callback ? conf.callback : scrollImg.computeScroll();//计算每次位移回调函数
				config.result = direct[config.direction];//确定哪个方向进行计算
				config.per = conf.per ? conf.per : 100;//每次位移多少像素,默认100
				config.move = conf.move ? conf.move : 1;//每次位移几个单位,默认1单位
				config.size = conf.size ? conf.size : 1;//窗口由几个单位宽或高组成,默认1单位
				config.speed = conf.speed ? conf.speed : 100;//每隔多少毫秒计算一次,默认50毫秒
				config.auto = conf.auto ? conf.auto : 5000;//每隔多少秒滚动一次,默认5秒
				config.selector = conf.selector ? conf.selector : '#mt_scrollPic ';//设置父节点,默认body
				config.num = $(config.selector + ' li').length;//图片的数量,默认一张图片
				config.btnNext = conf.btnNext;//左边按钮 jquery 选择器
				config.btnPrev = conf.btnPrev;//右边按钮 jquery 选择器
				mask.width = parseInt($(config.selector).css('width'));//遮罩层宽度
				mask.height = parseInt($(config.selector).css('height'));//遮罩层宽度
				if (!mask && !config) {
					throw new error("参数不正.");//@throws :参数不正
				}
				if (!config.num || config.num === 0) {
					throw new error("图片数量不正确.");//@throws :图片数量不正确
				}
				if (!config.move || config.move === 0) {
					throw new error("每次移动图片数量不正确.");//@throws :每次移动图片数量不正确	
				}
				if (Math.floor(config.num/config.move) < (config.num/config.move) && Math.ceil(config.num/config.move) > (config.num/config.move)) {
					throw new error("图片总量与移动图片数量不正对称,出现空白.");//@throws :图片总量与移动图片数量不正对称	
				}
				if ("top" === config.direction || "bottom" === config.direction) {
					if (config.per * config.size != mask.height) {
						throw new error("遮罩层长度与根据单位窗口长度计算出来的长度不对应.");//@throws :遮罩层长度与根据单位窗口长度计算出来的长度不对应
					}
				} else if("left" === config.direction || "right" === config.direction){
					if (config.per * config.size != mask.width) {
						throw new error("遮罩层长度与根据单位窗口长度计算出来的长度不对应.");//@throws :遮罩层长度与根据单位窗口长度计算出来的长度不对应
					}
				}
			},
			/**
			 * @function： 生成静态HTMl
			 * @description：生成静态HTMl
			 * @return 返回自身对象
			 */
			initHTMl : function() {
				try{
					callobj && callobj.before && callobj.before();//生成节点
				} catch(e) {
					throw new error("callobj.before函数运行异常.");
				}
				scrollImg.checkAndSplit(conf);
				$(config.selector + ' ul').append($(config.selector + " li:lt(" + config.size + ")").clone(true));//复制节点
				try{
					callobj && callobj.after && callobj.after();//生成节点后执行
				} catch(e) {
					throw new error("callobj.after函数运行异常.");
				}
				sImg = $(config.selector + ' ul');
				items = $(config.selector + ' li');
				return this;
			},
			/**
			 * @function： 默认：计算每次移动的函数
			 * @description：默认移动细节函数
			 * @param  node 容器节点
			 * @param  count 每次运行的图片统计定位
			 */
			computeScroll : function(direction) {
				var  running = {
					left :  function (node) {
						parseInt(node.css('left')) - 50;
					},
					right : function () {
						parseInt(node.css('left')) + 50;
					},
					top : function () {
						parseInt(node.css('top')) - 50;
					},
					bottom : function () {
						parseInt(node.css('top')) + 50;
					}
				};
				config.callback = running[direction || config.direction];
				return this;
			},
			/**
			 * @function： 获取反方向
			 * @description：获取反方向
			 * @return 返回反方向
			 */
			getReverseDirection : function(direct) {
				var direction = {
					left : 'right',
					right : 'left',
					top : 'bottom',
					bottom : 'top'
				};
				config.direction = direction[direct || config.direction];
				return this;
			},
			/**
			 * @function： 功能 (表示该变量指向一个功能)
			 * @description：说明
			 * @param  mask 遮罩层配置参数
			 * @return 返回自身对象
			 */
			setConfig : function (mask){
				//根据运动方向容器层
				if ("top" === config.direction || "bottom" === config.direction) {
					sImg.css({
						width : mask.width,
						height : 32678
					});
					if ("top" === config.direction) {
						sImg.css({top:0});
					} else {
						sImg.css({top:-config.per * config.num});
					}
				} else if("left" === config.direction || "right" === config.direction){
					sImg.css({
						width : 32678,
						height : mask.height
					});
					if ("left" === config.direction) {
						sImg.css({left:0});
					} else {
						sImg.css({left:-config.per * config.num});
					}
				}
				//添加移上去触发事件
				items.hover(function() {
					clearTimeout(delay);
					clearInterval(clock);
					clock = null;
					delay = null;
				}, function() {
					delay = setTimeout(scrollImg.running,500);
				});
				if (config.btnNext && config.btnPrev) {
					$(config.btnNext).click(function() {
						var direction = config.direction;
						if (config.direction === 'left' || config.direction === 'top') {
							scrollImg.running();
						} else {
							scrollImg.getReverseDirection().computeScroll().running();//取反方向运行
							scrollImg.clear();//清除当前运行状态
							scrollImg.getReverseDirection(direction).computeScroll().running();//还原当前方向
						}
					});
					$(config.btnPrev).click(function() {
						var direction = config.direction;
						if (config.direction === 'left' || config.direction === 'top') {
							scrollImg.getReverseDirection().computeScroll().running();//取反方向运行
							scrollImg.clear();//清除当前运行状态
							scrollImg.getReverseDirection(direction).computeScroll().running();//还原当前方向
						} else {
							scrollImg.running();
						}
					});
				}
				return this;
			},
			/**
			 * @function： 滚动功能
			 * @description：滚动主功能函数,计算每一次运行细节;外传回调函数处理加减细节;分为左上区,右下区,左上判断一样,右下判断一样;算法原则:上下运动围绕top变化数值,左右围绕left变化数值;
			 */
			compute : function (){
				sImg.css(config.result,config.callback(sImg, count));//回调函数
				if (config.direction === 'left' || config.direction === 'top') {
					if (Math.abs(parseInt(sImg.css(config.result))) > config.per * count * config.move) {//共同判断
						sImg.css(config.result,-config.per * count * config.move);
						if (count === Math.floor(config.num / config.move)) {
							sImg.css(config.result, 0);//可能计算超过，定位回原位
							count = 1;
						} else {
							count++;
						}
						scrollImg.clearAndRestart();
					}
				} else if (config.direction === 'right' || config.direction === 'bottom') {
					if (parseInt(sImg.css(config.result)) > 0 || Math.abs(parseInt(sImg.css(config.result))) < config.per * (config.num - (count * config.move))) {//共同判断
						sImg.css(config.result, -config.per * (config.num - (count * config.move)));
						if (count === Math.floor(config.num / config.move)) {
							sImg.css(config.result, -config.per * config.num);//可能计算超过，定位回原位
							count = 1;
						} else {
							count++;	
						}
						scrollImg.clearAndRestart();
					}
				}
			},
			/**
			 * @function： 清除并重启
			 * @description：清除并重启
			 */
			clearAndRestart : function() {
				clearInterval(clock);
				clock = null;
				delay = setTimeout(scrollImg.running, config.auto);
				try {
					callobj && callobj.complete && callobj.complete(sImg, count);//运行一次执行回调
				} catch (e) {
					throw new error("callobj.complete函数运行异常.");
				}
			},
			/**
			 * @function： 彻底清除移动
			 * @description：彻底清除移动
			 * @return 返回自身对象
			 */
			clear : function() {
				clearInterval(clock);
				clearTimeout(delay);
				clock = null;
				delay = null;
				return this;
			},
			/**
			 * @function： 延迟1秒滚动功能
			 * @description：初始化功能函数，延迟1秒
			 * @return 返回自身对象
			 */
			running : function (){
				//setTimeout(function(){
				clock = setInterval(function(){
					scrollImg.compute();
				},config.speed);
				//},1000);
				return this;
			},
			/**
			 * @function： 图片滚动功能初始化方法
			 * @description：初始化图片滚动
			 */
			init : function(){
				scrollImg.initHTMl().setConfig(mask).running();
			}
		};
		scrollImg.init();//组件内部初始化
	}
})(jQuery);