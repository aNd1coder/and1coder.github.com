/**
 * @name 		移动图片组件
 * @function    初始化为三张图片，依次移动
 * @date	 	2011.08.29
 * @author   	zhangwang
 * 
 */

/**
 * @function 通过样式获得节点数组
 * @param  	 {string} className	样式
 * @param    {string} tag	指定元素类型
 * @param    {node} elm  节点
 * @return   {array}  返回样式节点
 * 
 */
if(!document.getElementsByClassName){
	document.getElementsByClassName = function(className, tag, elm){
		var testClass = new RegExp("(^|\\s)" + className + "(\\s|$)");
		var tag = tag || "*";
		var elm = elm || document;
		var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
		var returnElements = [];
		var current;
		var length = elements.length;
		for(var i=0; i<length; i++){
			current = elements[i];
			if(testClass.test(current.className)){
				returnElements.push(current);
			}
		}
		return returnElements;
 	}
}
/**
 * @function 统一事件触发器
 * @param {Object} callback
 * @param {Object} eventType
 * @param {Object} obj
 */
if(!document.addEvent){
	document.addEvent = function(callback,eventType,obj){
		obj = obj || window;
		var event = function(){
			callback.apply(obj);
		}
		if(document.addEventListener){
			obj.addEventListener(eventType,event,false);
		}else if(document.attachEvent){
			obj.attachEvent("on" + eventType,event);
		}else{
			obj['on' + eventType] = event;
		}
		MoveImage.EVENT_REF[MoveImage.EVENT_REF.length] = {'eventType' : eventType,'event' : event,'obj' : obj};
 	}
}
/**
 * @function 移除事件触发器
 * @param {Object} callback
 * @param {Object} eventType
 * @param {Object} obj
 */
if(!document.removeEvent){
	document.removeEvent = function(callback,eventType,obj){
		obj = obj || window;
		if(document.removeEventListener){
			obj.removeEventListener(eventType,callback,false);
		}else if(document.detachEvent){
			obj.detachEvent("on" + eventType,callback);
		}else{
			obj['on' + eventType] = null;
		}
 	}
}
/**
 * @function 移动图片组件构造函数
 * @note 	 附加说明:对操作节点进行封装
 * 
 */
function MoveImage(imgs,links){
	var td_imgs;//小宽度的动态td
	var div_pos;//移动层
	var div_bg;//静态层
	var img_elems;//移动所需img元素数组
	this.getTdImgs = function(){
		return td_imgs;
	}
	this.setTdImgs = function(className,elemType){
		return td_imgs = document.getElementsByClassName(className,elemType);
	}
	this.getDivPos = function(){
		return div_pos;
	}
	this.setDivPos = function(className,elemType){
		return div_pos = document.getElementsByClassName(className,elemType);
	}
	this.getDivBg = function(){
		return div_bg;
	}
	this.setDivBg = function(className,elemType){
		return div_bg = document.getElementsByClassName(className,elemType);
	}
	this.getImgs = function(){
		return img_elems;
	}
	this.setImgs = function(className,elemType){
		return img_elems = document.getElementsByClassName(className,elemType);
	}
	if(imgs){
		if(typeof imgs === 'string'){
			this.pics = imgs.split(",");//装载图片容器
		}else if(typeof imgs === 'object' && imgs.length && imgs.length >= 3){
			this.pics = imgs;
		}
	}else{
		alert('pics argument must have exist!');
		return;
	}
	if(links){
		if(typeof links === 'string'){
			this.links = links.split(",");//装载图片容器
		}else if(typeof links === 'object' && links.length && links.length >= 3){
			this.links = links;
		}
	}else{
		alert('pics argument must have exist!');
		return;
	}
	return this;
}
/**
 * @function 移动图片组件原型
 * @note 	 附加说明:为了链式操作,操作函数return this
 * @author   zhangwang
 */
MoveImage.prototype =(function(){
		var start = 1;//第一张图片在数组中的位置
		/**
		 * @function 初始化HTML
		 */
		function init_html(){
			document.writeln("<style type='text/css'>                                                                                                            ");
			document.writeln("body,div,table,tr,th,td{margin:0;padding:0;}                                                                                       ");
			document.writeln(".m-scroll-wrapper{position:absolute;top:400px;left:300px;width:743px;height:230px;overflow: hidden;border-right:2px solid #9E1014;}");
			document.writeln(".m-scroll-wrapper table{border:none;border-spacing:0;width:743px;height:230px;border-collapse:collapse;}                           ");
			document.writeln(".m-scroll-wrapper td{border:none;cursor: pointer;}                                                                                 ");
			document.writeln(".m-transform{width:75px;z-index:1;position:relative;overflow: hidden;}                                                             ");
			document.writeln(".m-display{width:100%;height:230px;-webkit-height:228px;+height:235px;position: relative;}                                         ");
			document.writeln(".m-ready{width:100%;height:225px;border:2px solid #9E1014;position: relative;overflow: hidden;}                                    ");
			document.writeln(".m-img{position: absolute;top:0;left:0px;overflow: hidden;}                                                                        ");
			document.writeln(".m-img img{border:0;overflow: hidden;height:225px;width:522px;}                                                                    ");
			document.writeln(".m-display-1{width:100%;height:225px;border:2px solid #9E1014;position: relative;z-index:-2;cursor: pointer;}                      ");
			document.writeln(".m-display-2{width:100%;height:225px;border:2px solid #9E1014;position: absolute;top:0;left:500px;z-index:-1;cursor: pointer;}     ");
			document.writeln(".m-img{width:500px;height:225px;overflow: hidden;}                                                                                 ");
			document.writeln("</style>																															 ");
			document.writeln("<div class='m-scroll-wrapper'>                                                                                                     ");
			document.writeln("	<table id='m_wraper_table'>                                                                                                      ");
			document.writeln("		<tr>                                                                                                                         ");
			document.writeln("			<td>                                                                                                                     ");
			document.writeln("				<div class='m-display'>                                                                                              ");
			document.writeln("					<div class='m-display-1'>                                                                                        ");
			document.writeln("						<div class='m-img'>                                                                                          ");
			document.writeln("							<a id='m_one_link' target='_blank' href='javascript:void(0)' onclick='alert(1)'><img id='one_img' src='' alt='' /></a>      ");
			document.writeln("						</div>                                                                                                       ");
			document.writeln("					</div>                                                                                                           ");
			document.writeln("					<div class='m-display-2'>                                                                                        ");
			document.writeln("						<div class='m-img'>                                                                                          ");
			document.writeln("							<img class='c-img' src='' alt=''/>                                                         				 ");
			document.writeln("						</div>                                                                                                       ");
			document.writeln("					</div>                                                                                                           ");
			document.writeln("				</div>                                                                                                               ");
			document.writeln("			</td>                                                                                                                    ");
			document.writeln("			<td class='m-transform' runnum='0'>                                                                             		 ");
			document.writeln("				<div class='m-ready'>                                                                                                ");
			document.writeln("					<div class='m-img'>                                                                                              ");
			document.writeln("						<img class='c-img' src='' alt='' />                                                            				 ");
			document.writeln("					</div>                                                                                                           ");
			document.writeln("				</div>                                                                                                               ");
			document.writeln("			</td>                                                                                                                    ");
			document.writeln("			<td class='m-transform' runnum='1'>                                                                             		 ");
			document.writeln("				<div class='m-ready'>                                                                                                ");
			document.writeln("					<div class='m-img'>                                                                                              ");
			document.writeln("						<img class='c-img' src='' alt='' />                                                            				 ");
			document.writeln("					</div>                                                                                                           ");
			document.writeln("				</div>                                                                                                               ");
			document.writeln("			</td>                                                                                                                    ");
			document.writeln("		</tr>                                                                                                                        ");
			document.writeln("	</table>                                                                                                                         ");
			document.writeln("</div>                                                                                                                             ");
			document.writeln("<script type='text/javascript'>																									 ");
			document.writeln("(function(){                                                                                    ");
			document.writeln("	var ua = navigator.userAgent;                                                                 ");
			document.writeln("	var gecko = ua.indexOf('Gecko') > -1 && ua.indexOf('KHTML') === -1;                           ");
			document.writeln("	if(gecko){document.getElementById('m_wraper_table').style.height = MoveImage.FF_TABLE_HEIGHT;}");
			document.writeln("})();																							  ");
			document.writeln("</script>																															 ");

		}
		/**
		 * @function 回送效果-封装函数
		 * @param 	 {node} div 回送效果指定节点
		 * @param 	 {number} left	回送效果指定节点-左定位
		 * @param  	 {number} time	回送效果指定节点-触发频率
		 * 
		 */
		function back(div,left,time){
			var div_left = left,k = 1,that = this;
			var size = MoveImage.clock_run(function(){
				div_left = 30*Math.sin(Math.PI - k++*MoveImage.BACK_PARAM);
				div.style.left = div_left + "px";
				if(parseInt(div.style.left)< 1.1){
					div.style.left = "0px";
					MoveImage.clock_pause(size);
					that.one_img.setAttribute('src',that.pics[start]);
					that.getDivPos()[0].style.display = 'none';
					start++;
				}
			},time);
		}
		/**
		 * @function 每次移动切换一次图片效果
		 * 
		 */
		function changePic(){
			var imgs = this.getImgs();
			if(start >= this.length){start = 0;}
			for(var i = 0,j = start;i < MoveImage.IMG_NUMBER;i++,j++){
				if(j >= this.length){j = 0;}
				imgs[i].setAttribute('src',this.pics[j]);
			}
			this.m_one_link.setAttribute('href',this.links[start]);
		}
		/**
		 * @function 图片滚动前,对节点初始化
		 * 
		 */
		function move_init(div){
			div.style.left = MoveImage.IMG_LEFT + "px";
			div.style.display = 'block';
		}
		/**
		 * @function 当鼠标移上去扩展
		 * 
		 */
		function expand(){
			var size = MoveImage.clock_run(function(){
				if(parseInt(this.style.width) < MoveImage.IMG_EXPAND_WIDTH){//防止快速移动产生的不断自加
					this.style.width = (parseInt(this.style.width) + MoveImage.IMG_EXPAND_INTENSION) + "px";
				}
				if(parseInt(this.style.width) >= MoveImage.IMG_EXPAND_WIDTH){
					MoveImage.clock_pause(size);//根据计数size移去扩展效果
				}
			},MoveImage.TD_EXPAND_TIME,this);
			return size;
		}
		/**
		 * @function 当鼠标移上去缩小
		 * 
		 */
		function narrow(that,size){
			if(!!size){MoveImage.clock_pause(size);}
			size = MoveImage.clock_run(function(){
				if(parseInt(this.style.width) > MoveImage.IMG_NARROW_WIDTH){//防止快速移动产生的不断自减
					this.style.width = (parseInt(this.style.width) - MoveImage.IMG_EXPAND_INTENSION) + "px";
				}
				if(parseInt(this.style.width) <= MoveImage.IMG_NARROW_WIDTH){
					MoveImage.clock_pause(size);//根据计数size移去扩展效果
				}
			},MoveImage.TD_EXPAND_TIME,this);
			return size;
		}
		/**
		 * @function 当鼠标点击td,触发推送效果
		 * 
		 */
		function transport(that){
			var num = parseInt(this.getAttribute('runnum'));
			if(num === 0){
				that.move(MoveImage.BASE_FIRST_WIDTH,MoveImage.BASE_SECOND_WIDTH,MoveImage.ABO_DIV_LEFT,MoveImage.INNER_INTERNAL);
			}else if(num === 1){
				if(start >= this.length){start = 0;}
				start++;
				that.move(MoveImage.BASE_FIRST_WIDTH,MoveImage.BASE_SECOND_WIDTH,MoveImage.ABO_DIV_LEFT,MoveImage.INNER_INTERNAL);
			}
		}
		return {
			/**
			 * @function 初始化操作节点
			 */
			init : function(){
				init_html();//初始化节点
				this.setTdImgs('m-transform','td');
				this.setDivPos('m-display-2','div');
				this.setDivBg('m-display-1','div');
				this.setImgs('c-img','img');
				this.one_img = document.getElementById('one_img');
				this.m_one_link = document.getElementById('m_one_link');
				this.length = this.pics.length;
				var imgs = this.getImgs();
				for(var k = 0,length = imgs.length;k < length;k++){//初始化节点的图片
					imgs[k].setAttribute('src',this.pics[k]);
				}
				this.one_img.setAttribute('src',this.pics[0]);
				this.m_one_link.setAttribute('href',this.links[0]);
				var tds = this.getTdImgs(),that = this,expand_size,time_interval;//expand_size记录移动expand序列号
				/**
				 * @function 添加关联事件
				 * @param 	 {Object} i
				 * @param 	 {Object} value
				 * @memberOf {TypeName} 
				 */
				function addEventListener(i,value){
					document.addEvent(function(){
						MoveImage.clock_pause(MoveImage.OUTER_CLOCK);//暂停图片推送效果
						expand_size = expand.call(this);
					},"mouseover",value);
					document.addEvent(function(){
						narrow.call(this,that,expand_size);
						MoveImage.OUTER_CLOCK = that.run(MoveImage.OUTER_INTERNAL,MoveImage.BASE_FIRST_WIDTH,MoveImage.BASE_SECOND_WIDTH,MoveImage.ABO_DIV_LEFT,MoveImage.INNER_INTERNAL);//重启图片推送效果
					},"mouseout",value);
					document.addEvent(function(){
						var interval;//点击间隔时间---防止用户一通乱点
						if(!!time_interval){
							var mid_time = new Date().getTime();
							interval = mid_time - time_interval;
							time_interval = mid_time;
						}else{
							time_interval = new Date().getTime();
							interval = 0;
						}
						if(interval >= MoveImage.CLICK_DISTANCE || interval == 0){
							removeEventListener(i,value,'all');//删除所有关联事						
							transport.call(this,that);
							MoveImage.each(tds,function(j,val){addEventListener(j,val);});//重新关联所有事
						}
					},"click",value);
				}
				/**
				 * @function 删除关联事件
				 * @param 	 {Object} i
				 * @param 	 {Object} value
				 */
				function removeEventListener(i,value,type){
					if(type == 'all'){
						for(var i = 0,e = MoveImage.EVENT_REF,length = e.length;i < length;i++){
							document.removeEvent(e[i]['event'],e[i]['eventType'],e[i]['obj']);
						}//删除所有关联事件
						e.length = 0;//还原事件句柄数组
					}else if(type == 'group'){
						for(var i = 0,e = MoveImage.EVENT_REF,length = e.length;i < length;i++){
							if(e[i]['eventType'] == 'mouseout')
								document.removeEvent(e[i]['event'],e[i]['eventType'],value);
						}//删除所有关联事件
					}
				}
				MoveImage.each(tds,function(i,value){addEventListener(i,value);});
				return this;
			},
			/**
			 * @function 产生推进效果以及回送效果
			 * @param {number} fst	第一个td节点宽度
			 * @param {number} sec	第二个td节点宽度
			 * @param {number} left	定位div的左边距离
			 * @param {number} time	推进效果以及回送效果-触发频率
			 */
			move : function(fst,sec,left,time){
				var width_fst = fst,width_sec = sec,div_left = left,k = 1,tds = this.getTdImgs(),div = this.getDivPos()[0],that = this;
				move_init(div);
				changePic.apply(this);//更换图片函数
				//获得推进效果计数size
				var size = MoveImage.clock_run(function(){//推进效果-回调函数
					MoveImage.each(tds,function(i,value){//td节点遍历-回调函数
						if(i == 0){
							width_fst = width_fst + MoveImage.FIRST_PARAM * k;
							this.style.width = width_fst + "px";
						}else{
							width_sec = width_sec + MoveImage.SECOND_PARAM * k;
							this.style.width = width_sec + "px";
						}
					});
					div_left = div_left - (k++)*MoveImage.THREE_PARAM;
					div.style.left = div_left + "px";
					if(parseInt(div.style.left)< 0.1){
						back.call(that,div,40,time);//回送效果-调用函数
						MoveImage.clock_pause(size);//根据计数size移去推进效果
					}
				},time);
				return this;//链
			},
			/**
			 * @function 产生推进效果以及回送效果
 			 * @param {number} outer	外部每间隔多少秒触发一次
			 * @param {number} fst		第一个td节点宽度
			 * @param {number} sec		第二个td节点宽度
			 * @param {number} left		定位div的左边距离
			 * @param {number} inner	推进效果以及回送效果-触发频率
			 */
			run  : function(outer,fst,sec,left,inner){
				outer = outer ? (outer < 2000 ? 5000 : outer) : 5000;
				fst = fst ? ((fst >= 35 && fst <= 45) ? fst : 40) : 40;
				sec = sec ? ((sec >= 10 && sec <= 20) ? sec : 15) : 15;
				left = left ? ((left >= 200 && left <= 800) ? left : 500) : 500; 
				inner = inner ? (inner > 50 ? 50 : inner) : 50;
				var size = MoveImage.clock_run(function(){
					this.move(fst,sec,left,inner);
				},outer,this);
				return size;
			}
		};
})();
/**
 * @function 				遍历节点函数
 * @note   					附加说明：作为MoveImage工具方法
 * @param {array} elems		操作节点集
 * @param {function} calback操作节点回调函数
 * @param {array} args		回调函数参数(可选)
 */
MoveImage.each = function(elems,calback,args){
	value = elems[1];
	for(var i = 0,length = elems.length,value = elems[0];i < length;i++){
		value = elems[i];
		if(args){
			calback.apply(value,args);
		}else{
			calback.call(value,i,value);
		}
	}
}
/**
 * @function 				频率执行函数
 * @note   					附加说明：作为MoveImage工具方法
 * @param {function} calback每次执行的回调函数
 * @param {number} time		频率
 * @param {Object} obj		操作回调函数的对象
 * @param {array} args		回调函数参数(可选)
 */
MoveImage.clock_run = function(callback,time,obj,args){
	obj = obj || window;
	var size = MoveImage.clocks.length;
	MoveImage.clocks[size] = setInterval(function(){
		if(args){
			callback.apply(obj,args);
		}else{
			callback.apply(obj);
		}
	},time);
	return size;//返回缓存计数器当前数值
}
/**
 * @function 				频率终止函数
 * @note   					附加说明：作为MoveImage工具方法
 * @param {number} size		执行函数句柄在MoveImage.clocks中引用的位置
 */
MoveImage.clock_pause = function(size){
	if(!!MoveImage.clocks[size]){
		clearInterval(MoveImage.clocks[size]);
	}
	MoveImage.clocks[size] = null;
}
/**
 * 给MoveImage组件定义一个保存频率执行函数句柄的数组
 */
MoveImage.clocks = [];
/**
 * 第一个td每次移动系数
 */
MoveImage.FIRST_PARAM = 1.4;
/**
 * 第二个td每次移动系数
 */
MoveImage.SECOND_PARAM = 1.9;
/**
 * 第三个td每次移动系数
 */
MoveImage.THREE_PARAM = 10;
/**
 * 回送效果移动系数
 */
MoveImage.BACK_PARAM = 0.5;
/**
 * ff下面table bug修复
 */
MoveImage.FF_TABLE_HEIGHT = "231px";
/**
 * 图片节点数量
 */
MoveImage.IMG_NUMBER = 3;
/**
 * 移动图片节点起始距离
 */
MoveImage.IMG_LEFT = 520;
/**
 * 移动鼠标展开td元素时间系数
 */
MoveImage.TD_EXPAND_TIME = 30;
/**
 * td扩展宽度
 */
MoveImage.IMG_EXPAND_WIDTH = 140;
/**
 * td收缩宽度
 */
MoveImage.IMG_NARROW_WIDTH = 120;
/**
 * td伸缩强度
 */
MoveImage.IMG_EXPAND_INTENSION = 5;
/**
 * 最外层的监听器引用
 */
MoveImage.OUTER_CLOCK = null;
/**
 * 移动事件句柄
 */
MoveImage.EVENT_REF = [];
/**
 * 用户点击时间间隔（毫秒）
 */
MoveImage.CLICK_DISTANCE = 800;
/**
 * 间隔多少秒移动一次图片（毫秒）
 */
MoveImage.OUTER_INTERNAL = 5000;
/**
 * 第一td初始化宽度参数
 */
MoveImage.BASE_FIRST_WIDTH = 40;
/**
 * 第二td初始化宽度参数
 */
MoveImage.BASE_SECOND_WIDTH = 16;
/**
 * 绝对定位层左间距参数
 */
MoveImage.ABO_DIV_LEFT = 500;
/**
 * 内部间隔时间运行一次
 */
MoveImage.INNER_INTERNAL = 30;

var m = new MoveImage('http://static.mttang.com/fa/image/43f45d44-aa0c-4960-a3d1-9006f82df981.jpg,http://static.mttang.com/fa/image/7c7da4f5-6d4a-4393-af29-622e2642994c.jpg,http://static.mttang.com/fa/image/a848f1ff-99b7-4841-a238-f74264562c09.jpg,http://static.mttang.com/fa/image/97a5133e-bebf-4630-9201-38ef6a2f6eca.jpg,http://static.mttang.com/fa/image/39de170d-f57d-40ac-8c5d-d64cb2f57489.jpg,http://static.mttang.com/fa/image/a848f1ff-99b7-4841-a238-f74264562c09.jpg,http://static.mttang.com/fa/image/43f45d44-aa0c-4960-a3d1-9006f82df981.jpg,http://static.mttang.com/fa/image/39de170d-f57d-40ac-8c5d-d64cb2f57489.jpg','http://www.baidu.com,http://www.mttang.com,http://www.google.com.hk,http://www.baidu.com,http://www.mttang.com,http://www.google.com.hk,http://www.baidu.com,http://www.mttang.com,http://www.google.com.hk');
MoveImage.OUTER_CLOCK = m.init().move(MoveImage.BASE_FIRST_WIDTH,MoveImage.BASE_SECOND_WIDTH,MoveImage.ABO_DIV_LEFT,MoveImage.INNER_INTERNAL).run();
