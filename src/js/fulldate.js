// JavaScript Document
	m_full_date.CLONUM = 7;
	m_full_date.ROW = 5;
	function m_full_date(date){//构造函数
		this.monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
		this.weekday = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(',');
		this.currentDate = date ? date : new Date();
		this.year = this.currentDate.getYear();
		this.year = this.year < 2000 ? 1900 + this.year : this.year;
		this.month = this.currentDate.getMonth();
		this.date = this.currentDate.getDate();
		this.output();
		this.leftBt = $('.l-bt');
		this.rightBt = $('.r-bt');
		this.mMonth = $('.medium-month');
		this.today = $('.today');
		this.wrapper = $('.win-wrapper');
	}
	m_full_date.prototype=(function(){
		function down_callback(time,retext,flag){
				var jsonObj =flag? eval("("+retext+")"): retext;
				var str = "" ;
				$("#cache").data(time + '',jsonObj);
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
		function compare(date,month,year){
			var now = new Date();
			var y = now.getYear() < 2000 ? 1900 + now.getYear() : now.getYear();
			if(now.getDate() === parseInt(date) && now.getMonth() === parseInt(month) && y === parseInt(year)){
				return true;
			}
			return false;
		}
		return {
			init:function(){//初始化函数
				var self = this; 
				this.dispTime().dispToday().loadMonth(null);
				this.leftBt.click(function(e){self.left(e);});
				this.rightBt.click(function(e){self.right(e);});
			},
			output:function(){
				var str = 	"<div class='calendar'>                                                                                                                                "+
							"	<div class='c-title'>                                                                                                                              "+
							"		<span class='circle'></span>                                                                                                                   "+
							"		<h3>梦天堂活动日历专区</h3>                                                                                                                   "+
							"		<span class='today'></span>                                                                                                       "+
							"		<span class='left-bt'><a class='l-bt' href='javascript:void(0)'></a></span>                                                                    "+
							"		<span class='medium-month'></span>                                                                                                   "+
							"		<span class='right-bt'><a class='r-bt' href='javascript:void(0)'></a></span>                                                                   "+
							"	</div>                                                                                                                                             "+
							"	<div class='c-content'>                                                                                                                            "+
							"		<table cellspacing='1' cellpadding='1' class='table-list'>                                                                                     "+
							"			<thead>                                                                                                                                    "+
							"				<th>周日</th>                                                                                                                          "+
							"				<th>周一</th>                                                                                                                          "+
							"				<th>周二</th>                                                                                                                          "+
							"				<th>周三</th>                                                                                                                          "+
							"				<th>周四</th>                                                                                                                          "+
							"				<th>周五</th>                                                                                                                          "+
							"				<th>周六</th>                                                                                                                          "+
							"			</thead>                                                                                                                                   "+
							"<tbody id='c-tbody'>                                                                                                                                    "+
							"<tr>		 																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"</tr>       																															"+
							"<tr>        																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"</tr>       																															"+
							"<tr>        																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"</tr>       																															"+
							"<tr>        																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"</tr>       																															"+
							"<tr>        																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"	<td>&nbsp;</td>																															"+
							"</tr>       																															"+						"			</tbody>                                                                                                                                   "+
							"		</table>                                                                                                                                       "+
							"	<div class='c-dotted'></div>																													   "+
							"	</div>                                                                                                                                             "+
							"	<div class='win-wrapper' style='display: none;'>                                                                                                   "+
							"		<div class='m-hd'>																															   "+
							"		<div class='m-arrow'></div>                                                                                                                    "+
							"		<div class='m-header'></div>                                                                                                                   "+
							"		</div>																																		   "+
							"		<div class='m-body'>                                                                                                                           "+
							"			<div class='m-sub'>                                                                                                                        "+
							"			</div>                                                                                                                                     "+
							"		</div>                                                                                                                                         "+
							"		<div class='m-footer'></div>                                                                                                                   "+
							"    </div>                                                                                                                                            "+
							"</div>                                                                                                                                                ";
				$('.left-column').append(str);
				return this;
			},
			loadMonth:function(e){
				if (e && jQuery(e.target).hasClass('l-bt')) {				
					if (0 == this.month && this.year) {
						this.year -= 1; this.month = 11;
					} else {
						this.month -= 1;
					}
				} else if (e && jQuery(e.target).hasClass('r-bt')) {
					if (11 == this.month) {
						this.year += 1; this.month = 0;
					} else { 
						this.month += 1;
					}
				}
				var myself = this,self,clock,flag = true,d = new Date(this.year, this.month, 1),startIndex = d.getDay(),numdays = this.monthlengths[this.month];//隐藏弹出层
				if (1 == this.month && ((this.year%4 == 0 && this.year%100 != 0) || this.year%400 == 0)) numdays = 29;
				if((startIndex==5 && numdays==31)||(startIndex==6 && numdays>=30)){
					var tr = document.createElement('tr');
					for(var i = 0;i < m_full_date.CLONUM;i++){
						var td = document.createElement('td');
						td.innerHTML = '&nbsp;';
						tr.appendChild(td);
					}
					$('#c-tbody').append(this.tr = tr);
				}else{
					if(this.tr){
						$(this.tr).remove();
					}
				}
				var cells = $(".table-list td").unbind().removeClass('t_hover').empty();
				for(var i = 0 ;i < numdays;i++){
					var cell = $(cells.get(startIndex + i));
					if(compare(i + 1,this.month,this.year)){$(cell).addClass('t_hover');}
					$(cell).text(i + 1).unbind().hover(function(){
						self = $(this);
						var that = $(this);
						if(!!clock)clearTimeout(clock);//清除定时器
						clock = setTimeout(function(){
							var top = parseInt($(that).get(0).offsetTop) + 65;
							var left = parseInt($(that).get(0).offsetLeft) - 75;
							$(that).addClass('hover');
							myself.wrapper.css('top',top).css('left',left);
							myself.date = $(that).text();
							myself.list().wrapper.css('top',top).css('left',left);					
						},500);
					},function(){
						if(!!clock)clearTimeout(clock);//清除定时器
						$(self).removeClass('hover');
						$('.win-wrapper').hide();
					});
				}
				this.wrapper.unbind().hover(function(){
					$(self).addClass('hover');
					$(this).show();
				},function(){
					$(self).removeClass('hover');
					$('.m-sub').empty();
					$(this).hide();
				});
				return this;
			},
			left:function(e){
				if(this.year >= 2011 && this.month >= 0){this.loadMonth(e);}//限制不能小于2010-12月
				this.dispTime();
				return this;
			},
			right:function(e){
				this.loadMonth(e);
				this.dispTime();	
				return this;
			},
			dispTime : function(){
				var str_date = (this.year < 2000 ? 1900 + this.year : this.year) + "年" + (this.month + 1) + "月";
				this.mMonth.text(str_date);	
				return this;
			},
			dispToday : function(){
				var now = new Date();
				var year = now.getYear();
				var date = "今天：" + (year < 2000 ? 1900 + year : year) + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日  " + this.weekday[now.getDay()];
				this.today.text(date);
				return this;
			},
			list : function(){
				var date = new Date(this.year,this.month,this.date);
				var	time = date.getTime();
				var cache = $("#cache").data(time + '');
				$('.win-wrapper').show();
				if(cache){
					down_callback(time,cache,false) ;
				}else{
					$.ajax({
							type:"post",
							//dataType:"jsonp",
							jsonp:"callBack",
							url:"../act/actinfo.do",
							data:"method=ajaxQueryByDate&actTime="+time,
							success:function(retext){
								down_callback(time,retext,true) ;
							}
					 });
				}
				return this;
			}
		};								
	})();