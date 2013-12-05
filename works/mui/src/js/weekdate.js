// JavaScript Document
		m_weekdate.WEEKDATE = 7;
		function m_weekdate(){
			this.monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
			this.weekday = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(',');
			this.weeks = "第一周,第二周,第三周,第四周,第五周,第六周".split(',');
			this.currentDate = date ? date : new Date();
			this.year = this.currentDate.getYear();
			this.year = this.year < 2000 ? 1900 + this.year : this.year;
			this.month = this.currentDate.getMonth();
			this.day = this.currentDate.getDay();
			this.date = this.currentDate.getDate();
			this.numdays = this.monthlengths[this.month];
			this.remainDate = null;
			this.l_scroll = false;
			this.r_scroll = false;
			this.l_Bt = $('.x-l-bt');
			this.r_Bt = $('.x-r-bt');
			this.x_hd = $('.x-hd');
			this.x_lis = $('.x-table li');
			this.x_month = $('.x-medium-month');
			this.x_date = $('.x-date');
			this.list = $('.x-list');
		}
		m_weekdate.prototype = {
			/*初始化日期组件*/
			init : function(date){
				var self = this;
				this.pre();
				this.scrollMonth(null);
				this.l_Bt.click(function(e){self.left(e);});
				this.r_Bt.click(function(e){self.right(e);});
			},
			/*轮转一个月的周期以及关联元素操作*/
			scrollMonth : function(e){
				var myself = this;
				this.numdays = this.monthlengths[this.month];
				if (1 == this.month && ((this.year%4 == 0 && this.year%100 != 0) || this.year%400 == 0)) this.numdays = 29;
				if (e && jQuery(e.target).hasClass('x-l-bt')) {
					this.pre();
				} else if (e && jQuery(e.target).hasClass('x-r-bt')) {
					this.next();
				}
				var length = (parseInt(this.numdays) - this.startDate) > 7 ? m_weekdate.WEEKDATE : (parseInt(this.numdays) - this.startDate + 1);
				if(!m_weekdate.first){this._clear();}
				m_weekdate.first = false;
				for(var i = 0;i < length; i++){
					if(this.remainDate != undefined){
						if(i <= this.remainDate){
							continue;
						}
					}
					if(this.remainDate != undefined){
						var c_date = parseInt(this.startDate) + i - (this.remainDate + 1);
						myself.all_list(c_date);
						$(this.x_date.get(i)).text(c_date);
						$(this.x_lis.get(i)).hover(
							(function(j){
								return function(ev){
									myself._show(this,myself,j,ev);
								};
							})(i),
							(function(j){
								return function(ev){
									myself._hide(this,myself,j);
								}
							})(i)
						);
					}else{
						var c_date = parseInt(this.startDate) + i;
						this.all_list(c_date);
						$(this.x_date.get(i)).text(c_date);
						$(this.x_lis.get(i)).hover(
							(function(j){
								return function(ev){
									myself._show(this,myself,j,ev);
								}
							})(i),
							(function(j){
								return function(ev){
									myself._hide(this,myself,j);
								}
							})(i)
						);
					}
				}
				this.dispTime();
			},
			/*清除事件绑定以及置空*/
			_clear : function(){
				this.x_date.unbind().empty();
				this.list.unbind().empty();
			},
			down_list : function(d){
				if(d==""||d==undefined){
					alert("日期不存在");
					return false;
				}
				var date = new Date(this.year,this.month,parseInt(d));
				var curtime = date.getTime();
				$('.win-wrapper').css('display','block');
				$.ajax({
					type:"post",
					//dataType:"jsonp",
					jsonp:"callBack",
					url:"../act/actinfo.do",
					data:"method=ajaxQueryByDate&actTime="+curtime+"&ACTSTATE=0",
					success:function(retext){
						var jsonObj = eval("("+retext+")") ;
						var str = "" ;
						for(var i = 0;i<jsonObj.length;i++){
							str = str + "<p class='m-line'><span class='m-flag-1'></span><span class='m-ct'>" ;
							if(jsonObj[i].ACTNAME.length>4){
								jsonObj[i].ACTNAME = jsonObj[i].ACTNAME.substring(0,4) + "..."	;
							}
							str = str +"<a href='"+jsonObj[i].ACT_URL+"' onclick=writeRecoderLook('"+jsonObj[i].ACTID+"','0')>"+jsonObj[i].ACTNAME+"</a></span><span class='m-time'>" ;
							str = str + jsonObj[i].BEGIN_DATE+"-"+jsonObj[i].END_DATE+"</span></p>"
						}
						$('.m-sub').html(str);
						$('.win-wrapper').css('display','block');
					}
			 	});
			},
			all_list : function(d){
				var date = new Date(this.year,this.month,d);
				var curtime = date.getTime() ;
				$('.x-table').html("") ;
				$.ajax({
					type:"post",
					//dataType:"jsonp",
					jsonp:"callBack",
					url:"../act/actinfo.do",
					data:"method=ajaxQueryByDate1&actTime="+curtime+"&ACTSTATE=0",
					success:function(retext){
						var jsonObj = eval("("+retext+")") ;
						var str = "" ;
						for(var i = 0;i<jsonObj.length;i++){
							var jday = jsonObj[i].day ;
							str = str + "<li class=''>" ;
							switch(jday){
								case 0 : str = str + "<div class='x-hd'>周日</div>"; break;
								case 1 : str = str + "<div class='x-hd'>周一</div>"; break;
								case 2 : str = str + "<div class='x-hd'>周二</div>"; break;
								case 3 : str = str + "<div class='x-hd'>周三</div>"; break;
								case 4 : str = str + "<div class='x-hd'>周四</div>"; break;
								case 5 : str = str + "<div class='x-hd'>周五</div>"; break;
								case 6 : str = str + "<div class='x-hd'>周六</div>"; break;
							}
							str = str + "<div class='x-date'>"+jsonObj[i].date+"</div>" ;
							str = str + "<div class='x-list'>" ;
							for(var j = 0;j<jsonObj[i].list.length;j++){
								if(j==0){
									str = str + "<p><a class='x-red' href='"+jsonObj[i].list[j].ACT_URL+"'>"+jsonObj[i].list[j].ACTNAME+"</a></p>" ;
								}else{
									str = str + "<p><a class='x-gray' href='"+jsonObj[i].list[j].ACT_URL+"'>"+jsonObj[i].list[j].ACTNAME+"</a></p>" ;
								}
							}
							str = str + "</div></li>" ;
						}
						$('.x-table').append(str);
					}
			 	});
				
			},
			/*移出LI元素上显示行为*/
			_hide : function(self,myself,j){
				var x_hd = myself.x_hd.get(j);
				var text = $(myself.x_hd.get(j)).text();
				var out = setTimeout(function(){
					$('.win-wrapper').css('display','none');	
					$(self).removeClass('x-hover');
					$(x_hd).removeClass('x-hover');
				},1);
				$('.win-wrapper').hover(
					function(){
						clearTimeout(out);
					},function(){
						$('.win-wrapper').css('display','none');
						$(self).removeClass('x-hover');
						$(x_hd).removeClass('x-hover');	
					}
				);
			},
			/*移在LI元素上显示行为*/
			_show : function(self,myself,j,ev){
				$(self).addClass('x-hover');
				$(myself.x_hd.get(j)).addClass('x-hover');
				var text = $(myself.x_date.get(j)).text();
				var a = jQuery(ev.currentTarget).get(0);
				setTimeout(function(){
					if($.browser.msie&&($.browser.version == 6.0||$.browser.version == 7.0)){
						var top = parseInt(a.offsetTop) + 200;
						var left = parseInt(a.offsetLeft) - 75;
					}else{
						var top = parseInt(a.offsetTop) + 155;
						var left = parseInt(a.offsetLeft) - 95;
					}
					$('.win-wrapper').css('top',top).css('left',left);
					myself.down_list(text);
				},1);
			},
			/*左点击*/
			left : function(e){
				this.scrollMonth(e);
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
			/*计算一个周数以及处理当前天默认所在周数*/
			cal : function(currentDate){
				var date;
				if(currentDate){//处理默认所在周数
					date = new Date(currentDate);
					var end = date.getDay();
					var i = 1, remain = 2;
					var start = date.getDate();
					if(end == (m_weekdate.WEEKDATE - 1)){
						for(;remain > 1;i++){
							remain = parseInt(start)/(m_weekdate.WEEKDATE * i);
						}
					}else{
						start = start - (end + 1);
						for(;remain > 1;i++){
							remain = start/(m_weekdate.WEEKDATE * i);
						}
					}
					return i - 1;
				}else{//处理一个月内的周数总和
					date = new Date(this.year,this.month,this.numdays);
					var end = date.getDay();
					var i = 3, remain = 2;
					var start = date.getDate();
					if(end == (m_weekdate.WEEKDATE - 1)){
						for(;remain > 1;i++){
							remain = parseInt(start)/(m_weekdate.WEEKDATE * i);
						}
					}else{
						start = start - (end + 1);
						for(;remain > 1;i++){
							remain = parseInt(start)/(m_weekdate.WEEKDATE * i);
						}
					}
					return i - 1;
				}
			},
			/*点击向左的按钮的动作*/
			pre : function(){
				this.remainDate = undefined;//
				if(this.startDate){//如果有开始日期
					if((this.startDate > 1)&&(this.startDate <= m_weekdate.WEEKDATE)){
						this.startDate = 1;
						this.l_scroll = true;
						var date = new Date(this.year,this.month,1);
						this.remainDate = date.getDay() - 1;
						this.week = 0;
					}else{
						if(this.l_scroll){//确定要到下一个月
							if(this.month == 0){this.year -= 1;this.month = 11;}
							else{this.month -= 1;}
							this.numdays = this.monthlengths[this.month];
							this.week = this.cal();
							var date = new Date(this.year,this.month,this.numdays);
							this.startDate = this.numdays - date.getDay();
							this.l_scroll = false;
							this.r_scroll = true;
						}else{
							if(this.startDate == 1){//等于1情况
								if(this.month == 0){this.year -= 1;this.month = 11;}
								else{this.month -= 1;}
								this.numdays = this.monthlengths[this.month];
								this.week = this.cal();
								var date = new Date(this.year,this.month,this.numdays);
								this.remainDate = date.getDay();
								this.startDate = parseInt(this.numdays) + 1;
								this.r_scroll = true;
								this.l_scroll = false;
							}else{//默认情况
								this.startDate = this.startDate - m_weekdate.WEEKDATE;
								this.r_scroll = true;
								this.l_scroll = false;
								this.week--;
							}
						}
					}
				}else{//如果没有开始日期
					if(this.date < m_weekdate.WEEKDATE){
						this.startDate = 1;
						this.week = 0;
					}else{
						this.week = this.cal(this.currentDate);
						this.startDate = this.date - this.day;
					}
				}
			},
			/*点击向右的按钮的动作*/
			next : function(){
				var numdays ;//计算开始日期的中间变量
				if(this.remainDate != undefined){//是否有月底或者月初一周的剩余天数
					numdays = this.startDate + (m_weekdate.WEEKDATE - (this.remainDate + 1));
					this.remainDate = undefined;//还原
				}else{//在一个不间断的月内
					numdays = this.startDate + m_weekdate.WEEKDATE;
				}
				if(numdays <= this.numdays){//小于当前月所有的天数的情况
					this.startDate = numdays;
					var date = new Date(this.year,this.month,this.numdays);
					var endDate = this.numdays - date.getDay();
					if(this.startDate == endDate){this.r_scroll = true;}
					else{this.r_scroll = false;this.l_scroll = false;}
					this.week++;
				}else {//大于当前月所有的天数的情况
					if(this.r_scroll){
						var date = new Date(this.year,this.month,this.numdays);
						this.remainDate = date.getDay();
						if(this.month == 11){this.year += 1;this.month = 0;}
						else{this.month += 1;}
						this.week = 0;
						this.numdays = this.monthlengths[this.month];
						this.startDate = 1;
						this.r_scroll = false;
						this.l_scroll = true;
					}
				}
			}
		}