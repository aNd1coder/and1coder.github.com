// JavaScript Document
	SmallFullDate.CLONUM = 7;
	SmallFullDate.ROW = 5;
	function SmallFullDate(date){
		this.monthlengths = '31,28,31,30,31,30,31,31,30,31,30,31'.split(',');
		this.weekday = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(',');
		this.currentDate = date ? date : new Date();
		this.year = this.currentDate.getYear();
		this.year = this.year < 2000 ? 1900 + this.year : this.year;
		this.month = this.currentDate.getMonth();
		this.date = this.currentDate.getDate();
		this.output();
		this.leftBt = $('.d-f');
		this.rightBt = $('.d-t');
		this.mMonth = $('.d-s');
	}
	SmallFullDate.prototype={
		init:function(){
			var self = this; 
			this.dispTime();
			this.loadMonth(null);
			this.leftBt.click(function(e){self.left(e);});
			this.rightBt.click(function(e){self.right(e);});
		},
		output:function(){
			var str = 	"	<div class='sub-title'>                                             "+
						"		<span class='title-desp'>梦天堂活动月历</span>                  "+
						"	</div>                                                              "+
						"	<div class='date'>                                                  "+
						"		<div class='d-up'>                                              "+
						"			<span class='d-f'></span>                                   "+
						"			<span class='d-s'></span>                                   "+
						"			<span class='d-t'></span>                                   "+
						"		</div>                                                          "+
						"		<div class='d-down'>                                            "+
						"			<table cellspacing='1' cellpadding='1' class='d-table-list'>"+
						"				 <thead>                                                "+
						"				 <th>日</th>                                            "+
						"				 <th>一</th>                                            "+
						"				 <th>二</th>                                            "+                                                                            				
						"				 <th>三</th>                                            "+                                                                            				
						"				 <th>四</th>                                            "+                                                                            				
						"				 <th>五</th>                                            "+                                                                            				
						"				 <th>六</th>                                            "+       
						"				 </thead>                                               "+                                                                                  
						"				 <tbody id='d-body'>                                    "+                                                                                              
						"				 <tr>		 											"+																			
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																			
						"				 </tr>       											"+																		
						"				 <tr>        											"+																			
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																			
						"				 </tr>       											"+																		
						"				 <tr>        											"+																			
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																			
						"				 </tr>       											"+																		
						"				 <tr>        											"+																			
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																			
						"				 </tr>       											"+																		
						"				 <tr>        											"+																			
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																				
						"				 <td>&nbsp;</td>										"+																			
						"				 </tr>       											"+																					
						"				 </tbody>                                               "+                                                                                  		
						"			 </table>                                                   "+
						"		</div>                                                          "+
						"	</div>                                                              ";
			$('.date-column').append(str);
		},
		loadMonth:function(e){
			if (e && jQuery(e.target).hasClass('d-f')) {				
				if (0 == this.month && this.year) {
					this.year -= 1; this.month = 11;
				} else {
					this.month -= 1;
				}
			} else if (e && jQuery(e.target).hasClass('d-t')) {
				if (11 == this.month) {
					this.year += 1; this.month = 0;
				} else { 
					this.month += 1;
				}
			}
			var myself = this;
			var d = new Date(this.year, this.month, 1);
			var startIndex = d.getDay();
			var numdays = this.monthlengths[this.month];
			if (1 == this.month && ((this.year%4 == 0 && this.year%100 != 0) || this.year%400 == 0)) numdays = 29;
			if((startIndex==5 && numdays==31)||(startIndex==6 && numdays>=30)){
				var tr = document.createElement('tr');
				for(var i = 0;i < SmallFullDate.CLONUM;i++){
					var td = document.createElement('td');
					td.innerHTML = '&nbsp;';
					tr.appendChild(td);
				}
				$('#d-body').append(this.tr = tr);
			}else{
				if(this.tr){
					$(this.tr).remove();
				}
			}
			var cells = $(".d-table-list td").unbind().empty().removeClass('td_hover');;
			for(var i = 0 ;i < numdays;i++){
				var cell = $(cells.get(startIndex + i));
				if(this.compare(i + 1,this.month,this.year)){$(cell).addClass('td_hover');}
				$(cell).text(i + 1).hover(
					function(ev){$(this).addClass('hover');},
					function(e){$(this).removeClass('hover');}
				).click(function(){
					var time = myself.year+"-"+(myself.month+1)+"-"+$(this).text() ;
					var url = location.href ;
					location.href = url.substring(0,url.lastIndexOf("?")) + "?method=query&ACTTIME="+ time+"&type=time" ;
				});
			}
		},
		left:function(e){
			if(this.year >= 2011 && this.month >= 0){this.loadMonth(e);}
			this.dispTime();
		},
		right:function(e){
			this.loadMonth(e);
			this.dispTime();	
		},
		dispTime : function(){
			var str_date = (this.year < 2000 ? 1900 + this.year : this.year) + "年" + (this.month + 1) + "月";
			this.mMonth.text(str_date);	
		},
		compare : function(date,month,year){
			var now = new Date();
			var y = now.getYear();
			y = y < 2000 ? 1900 + y : y;
			if(y===year&&now.getDate() === parseInt(date) && now.getMonth() === parseInt(month)){
				return true;
			}
			return false;
		}
	}