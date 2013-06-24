MUI.add('mui.mttang.com.class',function(M){

	/**
	 * 创建Class类的类
	 * 
	 * @class Class
	 * @param {Object} option = {extend: superClass} 在option对象的extend属性中指定要继承的对象，可以不写
	 * @param {Object} object 扩展的对象
	 * @return {Object} 返回生成的日期时间字符串
	 * 
	 * @example
	 * MUI().add(function(M){
	 * 	var Person = new M.Class({
	 *  	init : function(name){
	 *  		this.name = name;
	 *  		alert("init");
	 *  	},
	 *  	showName : function(){
	 *  		alert(this.name);
	 *  
	 *  	}
	 *  
	 *  });
	 *  
	 *  // 继承Person
	 * 	var Person2 = new M.Class({extend : Person}, {
	 *  	init : function(name){
	 *  		this.name = name;
	 *  		alert("init");
	 *  	},
	 *  	showName : function(){
	 *  		alert(this.name);
	 *  
	 *  	}
	 *  
	 *  });
	 * 	
	 * };
	 * 
	 */
	 
	Class = function(){
		var length = arguments.length;
		var option = arguments[length-1];
		
		option.init = option.init || function(){};
		
		// 如果参数中有要继承的父类
		if(length === 2){
			/**
			 * @ignore
			 */
			var superClass = arguments[0].extend;
			
			/**
			 * @ignore
			 */
			var tempClass = function() {};
			tempClass.prototype = superClass.prototype;
			
			/**
			 * @ignore
			 */
			var subClass = function() {
				this.init.apply(this, arguments);
			}
			
			// 加一个对父类原型引用的静态属性
			subClass.superClass = superClass.prototype;
			
			// 指定原型
			subClass.prototype = new tempClass();
			
			// 重新指定构造函数
			subClass.prototype.constructor = subClass;
			
			M.extend(subClass.prototype, option);
			
			// 重载init方法，插入对父类init的调用
			subClass.prototype.init = function(){
				// 调用父类的构造函数
				// subClass.superClass.init.apply(this, arguments);
				// 调用此类自身的构造函数
				option.init.apply(this, arguments);
			};
			
			return subClass;
			
		// 如果参数中没有父类，则单纯构建一个类
		}else if(length === 1){
			/**
			 * @ignore
			 */
			var newClass = function() {
				this.init.apply(this, arguments);
			}
			newClass.prototype = option;
			return newClass;
		}
		
	};
	/*
	Class = function(obj){
		var tempClass = function() {
			this.init.apply(this, arguments);
		}
		tempClass.prototype = obj;
		return tempClass;
	};
	*/
	
});