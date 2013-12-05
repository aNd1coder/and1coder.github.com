/**
 *
 * Copyright (c) 2009 May(qq104010230)
 * http://www.winwill.com
 * http://www.winwill.com/jquery/jscroll.html
 * admin@winwill.com
 */
/*--------------------------------------------------------------------------------------------------*/
var ScrollBar = (function($){//使用时，ie6下面，必须加hidden
	$.fn.extend({//添加滚轮事件//by jun
		mousewheel:function(Func){
			return this.each(function(){
				var _self = this;
				_self.D = 0;//滚动方向
				if($.browser.msie||$.browser.safari){
					_self.onmousewheel = function() {
						_self.D = event.wheelDelta;
						event.returnValue = false;
						Func && Func.call(_self);
					}
				}else{
				   _self.addEventListener("DOMMouseScroll" , function(e){
						_self.D = e.detail > 0 ? -1 : 1;
						e.preventDefault();
						Func && Func.call(_self);
				   } , false); 
				}
			});
		}
	});
	function ScrollBar(options){
		this.defaulfConfig(options) ;//配置参数
	}
	ScrollBar.prototype = (function(){
		var width/*节点宽*/ , height/*节点高*/ , sWidth/*滚动条宽度*/ , rWidth/*滚动内容宽度*/ , nWidth/*箭头宽度*/ , unitH/*scrollbar高*/ , nHeight/*遮罩*/ , freqH/*幅度*/ , top = 0;
		var scrollLeft , scrollRight , scrollContent , scrollHd , scrollBd , scrollFt;
		var allowS = false , sp = 0 , isUp = 0 , sTime;
		var scroll = {//节点操作功能对象
			init : function(){//初始化操作
				var _self = this;
				$(_self.config.selector).each(function(i , val) {
					_self.build($(this));
				});
				return this;
			},
			build : function(_self){//构建节点树
				
				this.buildStructure(_self);//建筑结构
				
				//关联移动移出事件
				scrollHd.hover(function(){
					if(this.isUp == 0) {
						_self.css({background : this.config.Bar.Bg.Hover , "background-image" : this.config.BgUrl , "border-color" : this.config.Bar.Bd.Hover});
					}
				} , function(){
					if(this.isUp == 0) {
						_self.css({background : this.config.Bar.Bg.Out , "background-image" : this.config.BgUrl,"border-color" : this.config.Bar.Bd.Out})
					}
				});
				scrollBd.hover(function(){
					if(this.isUp == 0) {
						_self.css({background:this.config.Btn.uBg.Hover,"background-image":this.config.BgUrl});
					}
				} , function(){
					if(this.isUp == 0) {
						_self.css({background:this.config.Btn.uBg.Out,"background-image":this.config.BgUrl});
					}
				});
				scrollFt.hover(function(){
					if(this.isUp == 0) {
						_self.css({background:this.config.Btn.dBg.Hover,"background-image":this.config.BgUrl})
					}
				} , function(){
					if(this.isUp == 0) {
						_self.css({background:this.config.Btn.dBg.Out,"background-image":this.config.BgUrl})
					}
				});
				
				this.compute(_self , scrollContent);//计算滚动条
				
				return this;
			},
			buildStructure : function(_self , wh) {//建筑结构
				width = wh || _self.width() , height = _self.height();//width 遮罩宽度;height 遮罩高度;
				sWidth = this.config.W ? parseInt(this.config.W) : 10;//sWidth滚动条宽度
				rWidth = this.config.O ? width : width - sWidth;//滚动内容宽度
				nWidth = this.config.Btn.btn == true ? sWidth : 0;//nWidth箭头宽度
				
				
				this.buildTree(_self);//生成节点树
				
				scrollLeft = _self.children(".scroll-left").css({height : height});
				scrollContent = _self.find(".scroll-content");
				scrollRight = _self.children(".scroll-right");
				scrollHd = scrollRight.children(".scroll-hd");
				scrollBd = scrollRight.children(".scroll-bd");
				scrollFt = scrollRight.children(".scroll-ft");
				
				if($.browser.msie){
					document.execCommand("BackgroundImageCache", false, true);
				}
				
				//渲染样式
				_self.css({width : (this.config.O ? (width + sWidth + this.config.P) : width) , clear:'both' , zoom : 1 , overflow:'hidden'});
				scrollLeft.css({width : rWidth});
				scrollContent.css({width : rWidth});
				scrollRight.css({marginLeft: this.config.P,height : height , width : sWidth , background : this.config.Bg , "background-image" : this.config.BgUrl});
				scrollBd.css({width : sWidth - 2 , top : nWidth , background : this.config.Bar.Bg.Out , "background-image" : this.config.BgUrl , "border-color" : this.config.Bar.Bd.Out , borderRadius : '3px'});
				scrollHd.css({height : nWidth , background : this.config.Btn.uBg.Out , "background-image" : this.config.BgUrl});
				scrollFt.css({height : nWidth , background : this.config.Btn.dBg.Out , "background-image" : this.config.BgUrl});
			},
			buildTree : function(_self){//生成节点树
				if($(_self).find(".scroll-content").height() == null){//存在性检测
					$(_self).wrapInner("<div class='scroll-left' id='scrollLeft' style='float:left;overflow:hidden;position:relative;'><div class='scroll-content' id='scrollContent' style='position:absolute;top:0;width:100%;'></div></div>");
					$(_self).append("<div style='float:left;overflow:hidden;height:100%;-moz-user-select:none;position:relative;overflow:hidden;z-index:10000;' class='scroll-right' id='scrollRight'><div class='scroll-hd' id='scrollHd' style='position:absolute;top:0px;width:100%;left:0;background:blue;overflow:hidden'></div><div class='scroll-bd' id='scrollBd' style='background:green;position:absolute;left:0;-moz-user-select:none;border:1px solid'></div><div class='scroll-ft' id='scrollFt' style='position:absolute;bottom:0px;width:100%;left:0;background:blue;overflow:hidden'></div></div>");
				}
			},
			compute : function(_self , contentHeight , fn){//生成滚动条
				nHeight = scrollContent.height() || this.config.height || contentHeight;//内容高度
				delete this.config.height;
				//var unitH = Math.pow(height,2) / height ;//Math.pow(x,y)x的y次方
				//height - 2 * this.nWidth，滚动条高度；
				unitH = (height - 2 * nWidth) * height / nHeight;
				unitH = unitH < 10 ? 10 : unitH;
				freqH = unitH / 6;//滚动时候跳动幅度
				scrollBd.height(unitH);
				if(nHeight <= height) { //内容高度比遮罩低
					scrollLeft.css({padding:0});
					scrollRight.css({display:"none"});
				} else {
					allowS = true;
				}
				if(typeof _self == 'boolean' && _self) {
					fn && fn.apply(this,[core]);
					return;
				}
				if(this.config.Bar.Pos != "up"){//定位最底层
					top = height - unitH - nWidth;
					core.setOneTop();
				}
				
				this.assoEvent(_self);
				
				return this;
			},
			assoEvent : function(_self) {//关联事件,调用核心模块计算
				var myself = this;
				scrollBd.unbind("mousedown").bind("mousedown",function(e){//向上按钮关联
					myself.config['Fn'] && myself.config['Fn'].call(_self , nHeight);
					isUp = 1;
					scrollBd.css({background : myself.config.Bar.Bg.Focus , "background-image" : myself.config.BgUrl});
					var pageY = e.pageY , t = parseInt($(this).css("top"));
					$(document).mousemove(function(e2){
						top = t + e2.pageY - pageY;//pageY浏览器可视区域鼠标位置，screenY屏幕可视区域鼠标位置
						core.setOneTop();
					});
					$(document).mouseup(function(){
						isUp = 0;
						scrollBd.css({background:myself.config.Bar.Bg.Out,"background-image":myself.config.BgUrl,"border-color":myself.config.Bar.Bd.Out})
						$(document).unbind();
					});
					return false;
				});
				scrollHd.unbind("mousedown").bind("mousedown",function(e){//滑动块按钮关联
					isUp = 1;
					scrollHd.css({background:myself.config.Btn.uBg.Focus,"background-image":myself.config.BgUrl})
					core.setTimer("u" , function(){
						myself.config['Fn'] && myself.config['Fn'].call(_self , height - unitH - nWidth , top);
					});
					$(document).mouseup(function(){
						isUp = 0;
						scrollHd.css({background:myself.config.Btn.uBg.Out,"background-image":myself.config.BgUrl})
						$(document).unbind();
						clearTimeout(sTime);
						sp = 0;
					});
					return false;
				});
				scrollFt.unbind("mousedown").bind("mousedown",function(e){//向下按钮关联
					myself.config['Fn'] && myself.config['Fn'].call(_self , nHeight);
					isUp = 1;
					scrollFt.css({background:myself.config.Btn.dBg.Focus,"background-image":myself.config.BgUrl})
					core.setTimer("d");
					$(document).mouseup(function(){
						isUp = 0;
						scrollFt.css({background:myself.config.Btn.dBg.Out,"background-image":myself.config.BgUrl})
						$(document).unbind();
						clearTimeout(sTime);
						sp = 0;
					});
					return false;
				});
				scrollRight.unbind("mousedown").bind("mousedown",function(e){//滑动背景关联
					top = top + e.pageY - scrollBd.offset().top - unitH/2;
					myself.config['Fn'] && myself.config['Fn'].call(_self , height - unitH - nWidth , top);
					core.setTwoTop();
					return false;
				});
				_self.unbind("mousewheel").mousewheel(function(){//鼠标滑动块关联
					if(allowS != true) { return; }
					this.D > 0 ? top -= freqH : top += freqH;
					myself.config['Fn'] && myself.config['Fn'].call(_self , height - unitH - nWidth , top);
					core.setOneTop();
				});
			},
			extend : function(target , src , bool){
				var src = src || {};
				for(var i in src) {
					if (!(i in target)) {
						target[i] = src[i];
					}
					if(bool && (i in target) && typeof target[i] === "object") {
						this.extend(target[i] , src[i]);
					}
				}
				return target;
			},
			defaulfConfig : function(options){
				this.config = {
					W : "15px",//滚动条宽度
					O : false,//是否保留原始宽度，向外扩展
					P : 0,//边距距离
					BgUrl : "",//滚动条背景图片路径
					Bg : "#efefef",//背景位置或颜色
					Bar ://滑动块
					{
						Pos : "up",//初始化滑动块状态，向上or向下
						Bd : {Out : "#b5b5b5" , Hover : "#ccc"},//背景颜色
						Bg : {Out : "#fff" , Hover : "#fff" , Focus : "orange"}//背景颜色
					},
					Btn ://滑动条按钮
					{
						btn : true,//是否出现按钮
						uBg : {Out : "#ccc" , Hover : "#fff" , Focus : "orange"},//背景颜色
						dBg : {Out : "#ccc" , Hover : "#fff" , Focus : "orange"}//背景颜色
					},
					callback : function(){}//回调方法
				};
				return this.config = this.extend(options || {} , this.config);//配置参数附属当前对象(代码不美观，可改进)
			},
			rebuild : function(max){
				this.compute(true , max);
			}
		};
		var core = {//核心计算功能对象
				setOneTop : function() {//滑动块、滚动鼠标
					var nTop;
					if(top < nWidth) { top = nWidth;}
					if(top > height - unitH - nWidth) { top = height - unitH - nWidth;}
					nTop = - (( top - nWidth ) * nHeight / ( height - 2 * nWidth ));
					scrollBd.css({ top : top });
					scrollContent.css({ top : nTop });
				},
				setTwoTop : function() {//点击滑动背景调用
					var nTop;
					if(top < nWidth) { top = nWidth; }
					if(top > height - unitH - nWidth) { top = height - unitH - nWidth; }
					nTop = - (( top - nWidth ) * nHeight / ( height - 2 * nWidth ));
					scrollBd.stop().animate({ top : top } , 200);
					scrollContent.stop().animate({ top : nTop } , 200);
				},
				setTimer : function(d , fn) {//点击上下按钮调用
					var _self = this , t;
					if( d == "u" ) {
						top -= freqH; 
					} else {
						top += freqH;
					}
					fn && fn();
					this.setOneTop();
					sp += 2;
					t = (( t = (500 - sp * 50)) <= 0) ? 0 : t;
					sTime = setTimeout(function(){ 
						core.setTimer(d);
					} , t);
				}
		};
		return scroll.extend({},scroll);//返回继承属性集给prototype
	})();
	
	return ScrollBar;//返回滚动条
})(jQuery);