/*
#wrapper_sp{height:217px;width: 170px;position:relative;z-index:1;clear:both;margin:8px 0 0 10px;_margin:8px 0 0 5px;overflow:hidden;}
#wrapper_sp .bound{height:225px;width: 170px;}
#wrapper_sp .scroll_s{position:absolute;height:20px;width: 170px;display:block;bottom:0;left:0;z-index:2;}
#wrapper_sp .bound a{height:225px;width: 170px;display: block;}
#wrapper_sp .bound a img{height:213px;width: 166px;border:2px solid #F38E24;}
#wrapper_sp .cpages{height:15px;float: right;margin:0 0 0 5px;}
#wrapper_sp .cpages a.shover{background: #ff0;color:#FF0101;filter:alpha(opacity=80);-moz-opacity:0.8;-khtml-opacity: 0.8;opacity:0.8;}
#wrapper_sp .cpages a{float:left;height:17px;width:15px;background: #000;border:1px solid #ccc;margin:0 5px 0 0;color:#FFF; text-align:center; text-decoration:none;filter:alpha(opacity=40);-moz-opacity:0.4;-khtml-opacity: 0.4;opacity:0.4;}*/
/**
*  @function 单个图片轮换效果
*  @version  2.0
*  @author   zhangwang
*  @note     程序入口 m_scroll_pic.init(images,links,second,num,initImg,initLink);
*/
/**
* 2.0  移动上去切换图片
*/
               var m_scroll_pic = (function(){
                        var parentN = null;//img节点
               			var linkN = null;//整个容器
						/**
						 * @author  zhangwang
						 * @function  清楚前一个节点的样式
						 * @version 2.0
						 */
               			function clear(){
            				var elem = document.getElementById('bhover_0' + this.pre);
            				elem.className = '';
               			}
						/**
						 * @author  zhangwang
						 * @function  设置轮换节点样式以及图片节点的链接
						 * @version 2.0
						 */
               			function auto(){
							clear.apply(this);
							this.pre = this.time;
							linkN.setAttribute('src',this.arr[this.time - 1]);
							parentN.setAttribute('href',this.arrLinks[this.time - 1]);
							elem = document.getElementById('bhover_0' + this.time++);
							elem.className = 'shover';
							if(this.time > this.num){
								this.time = 1;
							}
               			}
						/**
						 * @author  zhangwang
						 * @function  图片滚动的构造函数
						 * @version 2.0
						 */
					    function m_scroll_pic(){//构造函数
							this.num = 4;//总图片个数
							this.time = 1;//当前在数组linkN第几个数值
							this.pre = 1;//保留当前第几个数值的记录
							this.arr = [];//图片地址
							this.arrLinks = [];//图片链接
						}
						/**
						* @author  zhangwang
						* @function  图片滚动的原型
						* @version 2.0
						*/
               			m_scroll_pic.prototype = {
							/**
							 * @author  zhangwang
							 * @function  设置轮转时间
							 * @param second 轮转间隔时间
							 * @version 2.0
							 */
							autoScroll : function(second){
								var self = this;
								second = second ? second*1000 : 5000;
								setInterval(function(){
									auto.apply(self);
								},second);
							},
							/**
							 * @author  zhangwang
							 * @function  每次轮转更换图片以及点击图片链接和右下角
							 * @param j 当前轮转图片的记录数
							 * @version 2.0
							 */
							changeImage : function(j){
								var self = this;
								clear.apply(self);
								this.time = j;
								this.pre = this.time;
								linkN.setAttribute('src',this.arr[this.time - 1]);
								parentN.setAttribute('href',this.arrLinks[this.time - 1]);
								elem = document.getElementById('bhover_0' + j);
								elem.className = 'shover';
							},
							/**
							 * @author  zhangwang
							 * @function  设置点击图片链接
							 * @param images 图片链接
							 * @version 2.0
							 */
							setImages:function(images){
								if(!arguments[0]){throw new Error();}
								if(typeof images == 'string'){
									this.arr = images.split(',');
								}
								if(Object.prototype.toString.call(images) === '[object Array]'){
									this.arr = images;
								}
							},
							/**
							 * @author  zhangwang
							 * @function  设置点击图片的链接
							 * @param links 链接参数
							 * @version 2.0
							 */
							setLinks : function(links){
								if(!arguments[0]){throw new Error();}
								if(typeof links == 'string'){
									this.arrLinks = links.split(',');
								}
								if(Object.prototype.toString.call(links) === '[object Array]'){
									this.arrLinks = links;
								}
							},
							/**
							 * @author  zhangwang
							 * @function  设置图片总数量
							 * @param num 图片总数量
							 * @version 2.0
							 */
							setnum : function(num){
								this.num = num;
							},
							/**
							* @author  zhangwang
							* @function  轮转图片结构
							* @param  num      设置图片数量
							* @param  initImg  默认放的第一张图片
							* @param  length   轮转图片总数
							* @version 2.0
							*/
							createTree : function(imgSrc,linkUrl,length){
								var self = this;
								var wrapper = document.getElementById('wrapper_sp');
								var bound = document.createElement('div');
								var scroll_s = document.createElement('div');
								var clear = document.createElement('div');
								var cpages = document.createElement('span');
								var a = document.createElement('a');
								var img = document.createElement('img');
								
								img.setAttribute('src',imgSrc);
								img.setAttribute('id','ahover_01');
								a.setAttribute('href',linkUrl);
								a.setAttribute('target','_blank');
								bound.className = 'bound';
								scroll_s.className = 'scroll_s';
								cpages.className = 'cpages';
								clear.style.clear = 'both';
								
								wrapper.appendChild(scroll_s);
								wrapper.appendChild(bound);
								bound.appendChild(a);
								a.appendChild(img);
								scroll_s.appendChild(cpages);
								wrapper.appendChild(clear);
								
								for(var i = 1;i <= length;i++){
									var link = document.createElement('a');
									link.setAttribute('id','bhover_0' + i);
									link.setAttribute('href','javascript:void(0)');
									(function(m){link.onmouseover = function(){self.changeImage(m);}})(i);
									if(i == 1){link.className = 'shover';}
									cpages.appendChild(link);
									link.appendChild(document.createTextNode(i));
								}
								parentN = a;
								linkN = img;
							},
							/**
							* @author  zhangwang
							* @function    initializete picture scroll component
							* @param  images   picture link
							* @param  links    after hit picture link
							* @param  second   每X秒轮换一次图片,参数3，就是3秒
							* @param  num      设置图片数量
							* @param  initImg  默认放的第一张图片
							* @param  initLink 点击默认第一张图片链接地址
							* @version 2.0
							*/
							init : function(images,links,second,num,initImg,initLink){
								if(!!images && images.constructor == Object){
									if (images.num && images.initImg && images.initLink && images.links && images.second && images.images) {
										this.setnum(images.num);
										this.createTree(images.initImg,images.initLink,images.num);
										this.setImages(images.images);
										this.setLinks(images.links);
										this.autoScroll(images.second);
									} else {
										throw new Error('参数不符合要求，请参考API！');
									}
								} else {
									if (arguments.length != 6) {
										throw new Error('参数不符合要求，请参考API！');
									}
									this.setnum(num);
									this.createTree(initImg,initLink,this.num);
									this.setImages(images);
									this.setLinks(links);
									this.autoScroll(second);
								}
							}
               			}
						m_scroll_pic.prototype.constructor = m_scroll_pic;
						return {
							getInstance : function(){
								return new m_scroll_pic();
							}
						}
               		}
               )();
