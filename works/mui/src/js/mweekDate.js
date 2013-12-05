// JavaScript Document
		function MWeekDate(){
			this.monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
			this.weekday = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(',');
			this.currentDate = date ? date : new Date();
			this.year = this.currentDate.getYear();
			this.year = this.year < 2000 ? 1900 + this.year : this.year;
			this.month = this.currentDate.getMonth();
			this.l_Bt = $('.x-l-bt');
			this.r_Bt = $('.x-r-bt');
			this.x_hd = $('.x-hd');
			this.x_lis = $('.x-table li');
			this.x_month = $('.x-medium-month');
			this.x_date = $('.x-date');
			this.list = $('.x-list');
			this.today = $('.x-today');
		}
		MWeekDate.prototype = (function(){
			function down_callback(curtime,retext,flag){
				var jsonObj = flag ? eval("("+retext+")") : retext;
				var str = "" ;
				$("#cache").data(curtime + '',jsonObj);
				for(var i = 0;i<jsonObj.length;i++){
					str = str + "<p class='m-line'><span class='m-flag-1'></span><span class='m-ct'>" ;
					if(jsonObj[i].ACTNAME.length>12){
						jsonObj[i].ACTNAME = jsonObj[i].ACTNAME.substring(0,12) + "..."	;
					}
					str = str +"<a href='"+jsonObj[i].ACT_URL+"' onclick=writeRecoderLook('"+jsonObj[i].ID+"','0') target='_blank'>"+jsonObj[i].ACTNAME+"</a></span><span class='m-time'>" ;
					str = str + jsonObj[i].BEGIN_DATE+"-"+jsonObj[i].END_DATE+"</span></p>"
				}
				$('.m-sub').html(str);
				$('.win-wrapper').css('display','block');
			}
			function all_callback(t,curtime,retext,flag){
				var jsonObj = flag ? eval("("+retext+")") : retext;		
				$("#cache").data('m_' + curtime + '',jsonObj);
				for(var i = 0;i < MWeekDate.WEEKDATE;i++){
					var str = "" ;
					for(var j =0; j < jsonObj[i].list.length;j++){
						if(j==0){
							str = str + "<p><a class='x-red' href='"+jsonObj[i].list[j].ACT_URL+"'><span class='x-list-" + j + "'></span><span class='x-list-desp'>"+jsonObj[i].list[j].ACTNAME+"</span></a></p>" ;
						}else{
							str = str + "<p><a class='x-gray' href='"+jsonObj[i].list[j].ACT_URL+"'><span class='x-list-" + j + "'></span><span class='x-list-desp'>"+jsonObj[i].list[j].ACTNAME+"</span></a></p>" ;
						}
					}
					$(t).eq(i).append(str) ;
				}
			}
			/*移出LI元素上显示行为*/
			function _hide(self,myself,j){
				var x_hd = myself.x_hd.get(j);
				$(myself.list.get(j)).removeClass('x-list-hover');
				$('.win-wrapper').hide();
				$(self).removeClass('x-hover');
				$(x_hd).removeClass('x-hover');	
			}
			/*移在LI元素上显示行为*/
			 function _show(self,myself,j,ev){
				$(self).addClass('x-hover');
				$(myself.x_hd.get(j)).addClass('x-hover');
				$(myself.list.get(j)).addClass('x-list-hover');
				var a = jQuery(ev.currentTarget).get(0);
				if($.browser.msie&&($.browser.version == 6.0||$.browser.version == 7.0)){
					var top = parseInt(a.offsetTop) + 195;
					var left = parseInt(a.offsetLeft) - 75;
				}else{
					var top = parseInt(a.offsetTop) + 148;
					var left = parseInt(a.offsetLeft) - 95;
				}
				$('.win-wrapper').css('top',top).css('left',left);
				myself.down_list(parseInt(myself.startDate) + j);
			}
			function compare(date,month,year){
				var now = new Date();
				var y = now.getYear();
				y = y < 2000 ? 1900 + y : y;
				if(y===year&&now.getDate() === parseInt(date) && now.getMonth() === parseInt(month)){
					return true;
				}
				return false;
			}
			function _min_month(){
				if(this.month == 0){this.year -= 1;this.month = 11;}
				else{this.month -= 1;}	
			}
			function _min(remain){
				if(remain <= 0){
					_min_month.apply(this);
					this.numdays = parseInt(this.monthlengths[this.month]);
					if (1 == this.month && ((this.year%4 == 0 && this.year%100 != 0) || this.year%400 == 0)) this.numdays = 29;
					this.startDate = this.numdays + remain;
				}else{
					this.startDate = remain;
				}
			}
			function _add_month(){
				if(this.month == 11){this.year += 1;this.month = 0;}
				else{this.month += 1;}	
			}
			/*清除事件绑定以及置空*/
			function _clear(){
				this.x_date.unbind().empty();
				this.list.unbind().empty();
			}
			return {
					/*初始化日期组件*/
					init : function(date){
						var self = this;
						this.firstWeek();
						this.dispToday();
						this.scrollMonth(null);
						this.l_Bt.click(function(e){self.left(e);});
						this.r_Bt.click(function(e){self.right(e);});
					},
					/*左点击*/
					left : function(e){
						if(this.year == 2011 && this.month == 0 && this.startDate == 2){return;	}
						if(this.year >= 2011 && this.month >= 0){this.scrollMonth(e);}
					},
					/*右点击*/
					right : function(e){
						this.scrollMonth(e);
					},
					/*显示在文本框周期*/
					dispTime : function(){
						var date = (this.year < 2000 ? 1900 + this.year : this.year) + "年" + (this.month + 1) + "月" + this.weeks[this.week];
						this.x_month.text(date);
					},
					/*轮转一个月的周期以及关联元素操作*/
					scrollMonth : function(e){
						var myself = this,date,clock,i = 0,j,num,that;
						if (e && jQuery(e.target).hasClass('x-l-bt')) {
							this.pre();
						} else if (e && jQuery(e.target).hasClass('x-r-bt')) {
							this.next();
						}
						this.numdays = parseInt(this.monthlengths[this.month]);
						if (1 == this.month && ((this.year%4 == 0 && this.year%100 != 0) || this.year%400 == 0)) this.numdays = 29;
						_clear.apply(this);
						this.all_list(this.startDate);
						for(j = this.startDate,flag = false;i < MWeekDate.WEEKDATE;i++,j++){
							$(this.x_date.get(i)).text((this.month + 1) + "月" + j + "日");
							if(compare(j,this.month,this.year)){$(this.x_hd.get(i)).removeClass('x-hd').addClass('x-hd-1');}
							else{$(this.x_hd.get(i)).removeClass('x-hd-1').addClass('x-hd');}
							if(i == 0){date = (this.month + 1) + "月"  + j + "日";}
							if(i == 6){date += "-" + (this.month + 1)+ "月"  + j + "日";}
							if(j == this.numdays){_add_month.apply(this);j = 0;flag = true;}
							$(this.x_lis.get(i)).hover(
								(function(j){
									return function(ev){
										that = this;
										num = j;
										if(!!clock){clearTimeout(clock);}
										clock = setTimeout(function(){
											_show(that,myself,j,ev);
										},500);
									};
								})(i),
								(function(j){
									return function(ev){
										if(!!clock){clearTimeout(clock);}
										_hide(this,myself,j);
									}
								})(i)
							);
						}
						$('.win-wrapper').hover(
							function(){
								var x_hd = myself.x_hd.get(num);
								$(myself.list.get(num)).addClass('x-list-hover');
								$('.win-wrapper').show();
								$(that).addClass('x-hover');
								$(x_hd).addClass('x-hover');	
							},function(){
								var x_hd = myself.x_hd.get(num);
								$(myself.list.get(num)).removeClass('x-list-hover');
								$('.win-wrapper').hide();
								$(that).removeClass('x-hover');
								$(x_hd).removeClass('x-hover');	
							}
						);
						if(flag){_min_month.apply(this);}//运行中跨月减1月 用于还原
						this.x_month.text(date);
					},
					down_list : function(d){
						var date = new Date(this.year,this.month,d);
						var curtime = date.getTime();
						var cache = $("#cache").data(curtime + '');
						$('.win-wrapper').css('display','block');
						if(cache){
							down_callback(curtime,cache,false) ;
						}else{
							$.ajax({
								type:"post",
								//dataType:"jsonp",
								jsonp:"callBack",
								url:"../act/actinfo.do",
								data:"method=ajaxQueryByDate&actTime="+curtime ,
								success:function(retext){
									 down_callback(curtime,retext,true) ;
								}
							});
						}
					},
					all_list : function(startDate){
						var date = new Date(this.year,this.month,startDate);
						var curtime = date.getTime();
						var cache = $("#cache").data('m_' + curtime + '');
						var t = $('.x-table .x-list');
						if(cache){
							all_callback(t,curtime,cache,false) ;
						}else{
							$.ajax({
								type:"post",
								//dataType:"jsonp",
								jsonp:"callBack",
								url:"../act/actinfo.do",
								data:"method=ajaxQueryByDate1&actTime="+curtime,
								success:function(retext){
									all_callback(t,curtime,retext,true);
								}
							});
						}
					},
					firstWeek : function(){
						var remain = this.currentDate.getDate() - this.currentDate.getDay();
						_min.apply(this,[remain]);
					},
					/*点击向左的按钮的动作*/
					pre : function(){
						var remain = this.startDate - MWeekDate.WEEKDATE;//中间变量
						_min.apply(this,[remain]);
					},
					/*点击向右的按钮的动作*/
					next : function(){
						var remain = this.startDate + MWeekDate.WEEKDATE;//中间变量
						this.numdays = parseInt(this.monthlengths[this.month]);
						if (1 == this.month && ((this.year%4 == 0 && this.year%100 != 0) || this.year%400 == 0)) this.numdays = 29;
						var monlen = this.numdays;//当前月总天数
						if(remain > monlen){
							_add_month.apply(this);
							this.startDate = remain - monlen;
						}else{
							this.startDate = remain;
						}
					},
					dispToday : function(){
						var now = new Date();
						var year = now.getYear();
						var date = "今天：" + (year < 2000 ? 1900 + year : year) + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日  " + this.weekday[now.getDay()];
						this.today.text(date);
					}
			};
		})();
		MWeekDate.WEEKDATE = 7;