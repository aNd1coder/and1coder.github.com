/**
 * @name 		图片上下左右组件
 * @function    初始化为三张图片，依次移动
 * @date	 	2011.09.05
 * @author   	zhangwang
 * 
 */
function ScrollImage(imgs,txts,links){
	function init_html(){
		document.writeln("<style type='text/css'>                                                                                         ");
		document.writeln("body,div,ul,li,p{margin:0;padding:0;}                                                                           ");
		document.writeln(".mtt-body{position: absolute;top: 100px;left: 100px;}                                                           ");
		document.writeln(".mtt-mask{width:522px;height:228px;overflow: hidden;position: relative;border: 1px solid red;}                  ");
		document.writeln(".mtt-imgs{width:100%;height:100%;position: absolute;top:0px;left: 0px;}                                         ");
		document.writeln(".mtt-mask ul,.mtt-mask li{list-style: none;list-style-type: none;}                                              ");
		document.writeln(".mtt-imgs li{width:522px;height:228px;}                                                                         ");
		document.writeln(".mtt-desps{position: absolute;top: 207px;left: 0px;height:20px;width:100%;}               					  ");
		document.writeln(".mtt-list-desps{width:100%;height:100%;clear: both;}                                                            ");
		document.writeln(".mtt-list-desps li{width:130px;height:20px;float: left;opacity: 0.5;filter:alpha(opacity=50);background: #555;cursor:pointer;}");
		document.writeln(".mtt-list-desps p{text-align: center;color:#fff;height:20px;}                                                   ");
		document.writeln(".mtt-list-desps p.mtt-hover{text-align: center;color:#000;background:#f00;}                                     ");
		document.writeln("</style>                                                                                                        ");
		document.writeln("<div class='mtt-body'>                                                                                          ");
		document.writeln("	<div class='mtt-mask'>                                                                                        ");
		document.writeln("		<ul class='mtt-imgs'>                                                                                     ");
		document.writeln("		</ul>                                                                                                     ");
		document.writeln("		<div class='mtt-desps'>                                                                                   ");
		document.writeln("			<ul class='mtt-list-desps'>                                                                           ");
		document.writeln("			</ul>                                                                                                 ");
		document.writeln("		</div>                                                                                                    ");
		document.writeln("	</div>                                                                                                        ");
		document.writeln("</div>                                                                                                          ");
	}
	/**
	 * @function 通过样式获得节点数组
	 * @param  	 {string} className	样式,例：$('.className li');
	 * @param    {string} tag	指定元素类型
	 * @param    {node} elm  节点
	 * @return   {array}  返回样式节点
	 * 
	 */
	function mtt(selector,tag, elm){
		var match = /\.([a-zA-Z_0-9\-]*)[|\s]*([a-zA-Z]+|)/.exec(selector);
		if(match && match[1]){
			var tag = tag || "*";
			var elm = elm || document;
			var elements = (tag == "*" && elm.all)? elm.all : elm.getElementsByTagName(tag);
			var returnElements = [];
			var current;
			var length = elements.length;
			for(var i=0; i<length; i++){
				current = elements[i];
				if(match && match[1] && (match[1] == current.className || (current.className.indexOf(match[1]) != -1))){
					if(match[2]){
						var childs = current.childNodes;
						for(var j = 0,length = childs.length; j < length;j++){
							if(childs[j].nodeType === 1){
								returnElements.push(childs[j]);
							}
						}
					}else{
						returnElements.push(current);
					}
				}
			}
			return returnElements;
		}
	}
	function init_img(ul,desp){
		var images = '',texts = '';
		if(!imgs[0] && !txts[0]){throw new Error('参数不正确！');}
		if(typeof imgs == 'string'){
			imgs = imgs.split(',');
		}
		if(typeof txts == 'string'){
			txts = txts.split(',');
		}
		if(typeof links == 'string'){
			txts = txts.split(',');
		}
		if(imgs.length != txts.length){
			throw new Error('图片数量必须跟图片描述比例一样！');
		}
		if(links.length != txts.length){
			throw new Error('链接数量必须跟图片描述比例一样！');
		}
		for(var len = imgs.length,i = 0;i < len;i++){
			images += "<li><a href='" + links[i] + "'><img src='" + imgs[i] + "'/></a></li>";
			if(i == 0){texts += "<li><p class='mtt-p mtt-hover'>" + txts[i] + "</p></li>";
			}else{texts += "<li><p class='mtt-p'>" + txts[i] + "</p></li>";}
		}
		ul.innerHTML = images;
		desp.innerHTML = texts;
	}
	init_html();
	this.ul = mtt('.mtt-imgs')[0];
	this.desp = mtt('.mtt-list-desps')[0];
	init_img(this.ul,this.desp);
	this.lis = mtt('.mtt-list-desps li');
	this.ps = mtt('.mtt-p');
	this.length = mtt('.mtt-imgs li').length;
	this.ul.style.top = '0px';
	this.count = 0;//当前图片的标号
	this.calcount = 0;//运行次数
	this.pre = this.ps[0];
}
ScrollImage.prototype=(function(){
	/**
	 * @function 自动移动图片以及算法
	 * @param {Object} index
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	function run(index){
		var that = this,k = 1;
		if(!!this.pre)this.pre.className = '';
		this.ps[index].className = 'mtt-hover';
		this.pre = this.ps[index];
		//this.count = index ? index : this.count;
		var size = ScrollImage.clock_run(function(){
			var top = parseInt(that.ul.style.top);
			if(top <= ((that.count * - ScrollImage.IMG_HEIGHT) + ScrollImage.START_HEIGHT)){
				top -= Math.sqrt(k++) * ScrollImage.MOVE_SLOW_PARAM;
				if(top <= (that.count * - ScrollImage.IMG_HEIGHT)){
					ScrollImage.clock_pause(size);
					that.ul.style.top = that.count * - ScrollImage.IMG_HEIGHT + 'px';
					that.calcount = k;
					return;
				}
			}else if(that.count < that.length){
				top -= k++ * ScrollImage.MOVE_SPEED_PARAM;
			}else if(that.count == that.length){
				var km = ScrollImage.IMG_HEIGHT*that.length/that.calcount;
				if(top >= -ScrollImage.START_HEIGHT){
					top += Math.sqrt(k++) * ScrollImage.MOVE_SLOW_PARAM;
					if(top >= 0){
						ScrollImage.clock_pause(size);
						that.ul.style.top = 0 + 'px';
						that.count = 0;
						return;
					}
				}else{
					top += km;
					k++;
				}
			}
			that.ul.style.top = top + 'px';
		},ScrollImage.MOVE_TIME,this.ul);
		this.count = (this.count == this.length)? 0 : this.count = this.count + 1;
		return this;
	}
	/**
	 * @function 自动移动图片以及算法
	 * @param {Object} index
	 * @memberOf {TypeName} 
	 * @return {TypeName} 
	 */
	function top(index){
		var height = index * ScrollImage.IMG_HEIGHT;
		var top = parseInt(this.ul.style.top);
		var that = this,remain = (-height) - top,k = 0,rm = remain;
		this.count = parseInt(index);
		if(!!this.pre)this.pre.className = '';
		this.ps[index].className = 'mtt-hover';
		this.pre = this.ps[index];
		var size = ScrollImage.clock_run(function(){
			var km = rm/(that.calcount = (that.calcount == 0 ? 19 : that.calcount));
			top = parseInt(that.ul.style.top);
			remain = (-height) - top;
			if(Math.abs(remain) <= ScrollImage.START_HEIGHT){
				if(km < 0){top += -Math.sqrt(k++) * ScrollImage.MOVE_SLOW_PARAM;}
				else{top += Math.sqrt(k++) * ScrollImage.MOVE_SLOW_PARAM;}
				if(km < 0){
					if(top < -height){//往下翻
						closeRoll(that,size);
					}
				}else{
					if(top >= -height){//往上翻
						closeRoll(that,size);
					}
				}
			}else{
				top += (km > 0?(k++ * ScrollImage.MOVE_SPEED_PARAM):-(k++ * ScrollImage.MOVE_SPEED_PARAM));
			}
			that.ul.style.top = top + 'px';
		},ScrollImage.MOVE_TIME);
		/**
		 * @function 结束翻滚
		 * @param {Object} that
		 * @return {TypeName} 
		 */
		function closeRoll(that,size){
			ScrollImage.clock_pause(size);
			that.ul.style.top = (-height) + 'px';
			return;
		}
	}
	/**
	 * @function 添加事件
	 * @memberOf {TypeName} 
	 */
	function addEvent(){
		var that = this;
		var defer = [];
		ScrollImage.each(this.lis,function(i,value){
			document.addEvent(function(){
				var time = setTimeout(function(){
					that.move(i);
				},ScrollImage.TIME);
				defer.push({'time':time,'obj':this});
			},"mouseover",value);
		});
		ScrollImage.each(this.lis,function(i,value){
			document.addEvent(function(){
				var elem = defer.pop();
				if(!!elem){
					clearTimeout(elem['time']);
				}
			},"mouseout",value);
		});
	}
	/**
	 * @function 删除事件
	 * @memberOf {TypeName} 
	 */
	function removeEvent(){
		var e = ScrollImage.EVENT_REF;
		var length = e.length;
		for(var i = 0;i < length;i++){
			document.removeEvent(e[i]['event'],e[i]['eventType'],e[i]['obj']);
		}
		e.length = 0;
	}
	return {
		init : function(){
			var num = 0,that = this;
			this.size = ScrollImage.clock_run(function(){
				if(num == that.length){num = 0;}
				run.apply(this,[num]);
				num++;
			},ScrollImage.TIMES,this);
			addEvent.apply(this);
			return this;
		},
		move : function(index){
			ScrollImage.clock_pause(this.size);
			removeEvent.apply(this);
			top.apply(this,[index]);
			this.init();
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
ScrollImage.each = function(elems,calback,args){
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
 * @function 事件触发器统一
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
		ScrollImage.EVENT_REF[ScrollImage.EVENT_REF.length] = {'eventType' : eventType,'event' : event,'obj' : obj};
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
 * @function 				频率执行函数
 * @note   					附加说明：作为ScrollImage工具方法
 * @param {function} calback每次执行的回调函数
 * @param {number} time		频率
 * @param {Object} obj		操作回调函数的对象
 * @param {array} args		回调函数参数(可选)
 */
ScrollImage.clock_run = function(callback,time,obj,args){
	obj = obj || window;
	var size = ScrollImage.clocks.length;
	ScrollImage.clocks[size] = setInterval(function(){
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
 * @note   					附加说明：作为ScrollImage工具方法
 * @param {number} size		执行函数句柄在ScrollImage.clocks中引用的位置
 */
ScrollImage.clock_pause = function(size){
	clearInterval(ScrollImage.clocks[size]);
	ScrollImage.clocks[size] = null;
}
ScrollImage.clocks = [];
/**
 * 图片的宽度
 */
ScrollImage.IMG_HEIGHT = 229;
/**
 * 图片的缓移动起始高度
 */
ScrollImage.START_HEIGHT = 60;
/**
 * 图片的缓移动系数
 */
ScrollImage.MOVE_SLOW_PARAM = 1.5;
/**
 * 图片的快移动系数
 */
ScrollImage.MOVE_SPEED_PARAM = 5;
/**
 * 图片的移动时间系数
 */
ScrollImage.MOVE_TIME = 25;
/**
 * 移动事件句柄
 */
ScrollImage.EVENT_REF = [];
/**
 * 移动上去的延迟时间
 */
ScrollImage.TIME = 500;
/**
 * 移动图片的频率
 */
ScrollImage.TIMES = 5000;

var si = new ScrollImage(['http://static.mttang.com/fa/image/43f45d44-aa0c-4960-a3d1-9006f82df981.jpg','http://static.mttang.com/fa/image/7c7da4f5-6d4a-4393-af29-622e2642994c.jpg','http://static.mttang.com/fa/image/a848f1ff-99b7-4841-a238-f74264562c09.jpg','http://static.mttang.com/fa/image/97a5133e-bebf-4630-9201-38ef6a2f6eca.jpg'],['zhangwang1','zhangwang2','zhangwang3','zhangwang4'],['http://www.baidu.com','http://www.qq.com','http://www.google.com','http://www.yahoo.com']);
si.init();