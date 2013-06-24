MUI.add('util.tool',function(M){
	var isUndefined,
		isNull,
		isNumber,
		isBoolean,
		isString,
		isObject,
		isArray,
		isArguments,
		isFunction,
		forEach,
		each,
		type,
		isType,
		array,
		indexOf,
		random,
		clone,
		$try,
		extend,
		now,
		timedChunk,
		getLength,
		bind;
	
		/**
		 * 判断变量的值是否是 undefined
		 * Determines whether or not the provided object is undefined
		 * 
		 * @method isUndefined
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的值是 undefined 时返回 true
		 */
		isUndefined = function(o) {
			return typeof(o) === "undefined";
		};
			
		/**
		 * 判断变量的值是否是 null
		 * Determines whether or not the provided object is null
		 * 
		 * @method isNull
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的值是 null 时返回 true
		 */
		isNull = function(o) {
			return o === null;
		};
		
		/**
		 * 判断变量的类型是否是 Number
		 * Determines whether or not the provided object is a number
		 * 
		 * @memberOf MUI.prototype
		 * @method isNumber
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 number 时返回 true
		 */
		isNumber = function(o) {
			return (o === 0 || o) && o.constructor === Number;
		};
		
		/**
		 * 判断变量的类型是否是 Boolean
		 * Determines whether or not the provided object is a boolean
		 * 
		 * 
		 * @method isBoolean
		 * @memberOf MUI.prototype
		 * 
		 * @static
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 boolean 时返回 true
		 */
		isBoolean = function(o) {
			return (o === false || o) && (o.constructor === Boolean);
		};
		
		/**
		 * 判断变量的类型是否是 String
		 * Determines whether or not the provided object is a string
		 * 
		 * 
		 * @method isString
		 * @memberOf MUI.prototype
		 * 
		 * @static
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 string 时返回 true
		 */
		isString = function(o) {
			return (o === "" || o) && (o.constructor === String);
		};
		
		/**
		 * 判断变量的类型是否是 Object
		 * Determines whether or not the provided object is a object
		 * 
		 * 
		 * @method isObject
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 object 时返回 true
		 */
		isObject = function(o) {
			return (o && (o.constructor === Object))
				|| (String(o)==="[object Object]");
		};
		
		/**
		 * 判断变量的类型是否是 Array
		 * Determines whether or not the provided object is a array
		 * 
		 * 
		 * @method isArray
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 array 时返回 true
		 */
		isArray = function(o) {
			return o && (o.constructor === Array);
		};
		
		/**
		 * 判断变量的类型是否是 Arguments
		 * Determines whether or not the provided object is a arguments
		 * 
		 * 
		 * @method isArguments
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 arguments 时返回 true
		 */
		isArguments = function(o) {
			return o && o.callee && isNumber(o.length) ? true : false;
		};
		
		/**
		 * 判断变量的类型是否是 Function
		 * Determines whether or not the provided object is a function
		 * 
		 * 
		 * @method isFunction
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {Boolean} 当 o 的类型是 function 时返回 true
		 */
		isFunction = function(o) {
			return o && (o.constructor === Function);
		};
	
		/**
		 * 判断变量类型的方法
		 * 
		 * 
		 * @method type
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {String} 返回变量的类型，如果不识别则返回 other
		 */
		 
		forEach = function( object, callback, args ) {
			var name, i = 0,
				length = object.length,
				isObj = length === undefined || jQuery.isFunction(object);

			if ( args ) {
				if ( isObj ) {
					for ( name in object ) {
						if ( callback.apply( object[ name ], args ) === false ) {
							break;
						}
					}
				} else {
					for ( ; i < length; ) {
						if ( callback.apply( object[ i++ ], args ) === false ) {
							break;
						}
					}
				}

			// A special, fast, case for the most common use of each
			} else {
				if ( isObj ) {
					for ( name in object ) {
						if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
							break;
						}
					}
				} else {
					for ( var value = object[0];
						i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
				}
			}

			return object;
		};
		
		/**
		 * 判断变量类型的方法
		 * 
		 * 
		 * @method type
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} callback 回调函数
		 * @param {Mixed} args 	  传入参数
		 * @return {object} 返回slef-scope
		 */
		 
		 each = function(callback, args){
			return forEach(this, callback, args );
		 };
		
		/**
		 * 判断变量类型的方法
		 * 
		 * 
		 * @method type
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} o 传入被检测变量的名称
		 * @return {String} 返回变量的类型，如果不识别则返回 other
		 */
		 
		type = function(o) {
			return typeof o;
		};
		
		/**
		 * 判断变量类型的方法
		 *
		 * 
		 * @method isType
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} object 传入被检测变量的名称
		 * @param {Mixed} type  指定类型或者类的对象
		 * @return {boolean} 返回变量的类型，如果不识别则返回 other
		 */
		 
		isType = function(object, type) {
			if (typeof type === 'string')
				return typeof object === type;

			if (object === null || object === undefined)
				return false;

			return (typeof type === 'function' && object instanceof type) || object.constructor === type;
		};
		
		/**
		 * 把类数组类型转变成数组 的方法
		 * 
		 * 
		 * @method array
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} enumerable 转变的参数类型
		 * @return {Array} 返回转化后的数组类型
		 */
		 
		array = function(enumerable) {
			var array = [], i = enumerable.length;
			while (i--) array[i] = enumerable[i];
			return array;
		};
		
		/**
		 * 定位值在数组的位置方法
		 * 
		 * 
		 * @method indexOf
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} list 数组
		 * @param {Mixed} item 定位值
		 * @return {number} 返回定位值or-1
		 */
		 
		indexOf = function(list, item) {
			if (list.indexOf) return list.indexOf(item);
			var i = list.length;
			while (i--) {
				if (list[i] === item) return i;
			}
			return -1;
		};
		
		/**
		 * 生成随机数的方法
		 * 
		 * @method random
		 * @memberOf MUI.prototype
		 * 
		 * @param {Number} min 生成随机数的最小值
		 * @param {Number} max 生成随机数的最大值
		 * @return {Number} 返回生成的随机数
		 */
		 
		random = function(min, max){
			return Math.floor(Math.random() * (max - min + 1) + min);
		};
		
		/**
		 * 克隆一个对象
		 * 
		 * @method clone
		 * @memberOf MUI.prototype
		 * 
		 * @param {Object} o 要克隆的对象
		 * @return {Object} 返回通过克隆创建的对象
		 * 
		 * @example
		 * MUI().add(function(M){
		 * 	var objA = {name: "zhangwang"};//Kinvix
		 * 	// 克隆一个 objA 对象，并存入 objB 中。
		 * 	var objB = M.clone(objA);
		 * };
		 */
		 
		clone = function(o){
			var tempClass = function(){};
			tempClass.prototype = o;
			
			// 返回新克隆的对象
			return (new tempClass());
		};

		
		/**
		 * 从第一个函数开始try，直到尝试出第一个可以成功执行的函数就停止继续后边的函数，并返回这个个成功执行的函数结果
		 * 
		 * @method $try
		 * @memberOf MUI.prototype
		 * 
		 * @param {Function} fn1, fn2, .... 要尝试的函数
		 * @return {Mixed} 返回第一个成功执行的函数的返回值
		 * 
		 * @example
		 * MUI().add(function(M){
		 * 	// 按顺序执行 funcA, funcB, funcC，当中途有一个 func 的执行结果返回 true 则不再往下执行，并返回成功执行的 func 的返回值；
		 * 	M.$try(funcA, funcB, funcC);
		 * };
		 */
		 
		$try = function(){
			var i,
				l = arguments.length,
				result;
				
			for(i = 0; i < l; i++){
				try{
					result = arguments[i]();
					// 如果上边语句执行成功则执行break跳出循环
					break;
				}catch(e){
					M.out("C.错误：[" + e.name + "] "+e.message+", " + e.fileName+", 行号:"+e.lineNumber+"; stack:"+typeof e.stack, 2);
				}
			}
			return result;
		};
		
		/**
		 * 对一个对象或数组进行扩展
		 * 
		 * @method extend
		 * @memberOf MUI.prototype
		 * 
		 * @param {Mixed} destination 被扩展的对象或数组
		 * @param {Mixed} extendObj1, extendObj2, .... 用来参照扩展的对象或数组
		 * @return {Mixed} 返回被扩展后的对象或数组
		 * 
		 * @example
		 * MUI().add(function(M){
		 * 	// 用 objB 和objC 扩展 objA 对象；
		 * 	M.extend(objA, objB, objC);
		 * };
		 * 
		 */
		extend = function(destination, cpyObj1, cpyObj2){
			var a = arguments,
				i,
				p,
				destination,
				extendObj;
				
			if(a.length === 1){
				destination = this;
				i=0;
			}else{
				destination = a[0] || {};
				i=1;
			}
			
			for(; i<arguments.length; i++){
				extendObj = arguments[i];
				for(p in extendObj){
					var src = destination[p],
						obj = extendObj[p];
					if ( src === obj ){
						continue;
					}
					
					if ( obj && isObject(obj) && !obj.nodeType && !isFunction(obj)){
						src = destination[p] = {};
						src = extend( destination[p], 
							// Never move original objects, clone them
							obj || ( obj.length != null ? [ ] : { } ));

					// Don't bring in undefined values
					}else if ( obj !== undefined ){
						destination[p] = obj;
					}
				}
			}

			return destination;
		};
		
		/**
		 * 获取当前时间的函数
		 * 
		 * @method now
		 * @memberOf MUI.prototype
		 * 
		 * 
		 * 
		 * @example
		 * alert(M.now());
		 * 
		 */
		 
		now = function(){
			return +new Date;
		}
		
		/**
		 * 通用分时处理函数
		 * 
		 * @method timedChunk
		 * @memberOf MUI.prototype
		 * 
		 * 
		 * @example
		 * MUI().add(function(M){
		 * };
		 * 
		 */
		 
		timedChunk = function(items, process, context, isShift, callback) {
			var todo = items.concat(), delay = 25;
			if(isShift){
				todo = items;
			}
			
			window.setTimeout(function() {
				var start = +new Date();
	 
				do {
					process.call(context, todo.shift());
				} while(todo.length > 0 && (+new Date() - start < 50));
	 
				if(todo.length > 0) {
					window.setTimeout(arguments.callee, delay);
				} else if(callback) {
					callback(items);
				}
			}, delay);
		}
		
		/**
		 * 获取对象自身具有的属性和方法的数量
		 * 
		 * @method getLength
		 * @memberOf MUI.prototype
		 * 
		 * @param {Object} obj 要获取的对象
		 * @return {Number} 返回对象自身具有属性和方法的数量
		 */
		 
		getLength = function(obj) {
			var p,
				count = 0;
			for(p in obj){
				if(obj.hasOwnProperty(p)){
					count++;
				}
			}
			return count;
		};
		
		/**
		 * 将一个函数绑定给一个对象作方法，返回的函数将总被传入{@code obj} as {@code this}
		 * 
		 * @memberOf MUI.prototype
		 * @param {Function} func 要绑定的函数
		 * @param {Object} contextObj 要绑定的对象
		 * @param {Mixed} args 参数列表，长度任意
		 * @return {Function} 返回一个被绑定this上下文对象的函数
		 * 
		 * @example
		 * MUI().add(function(M){
		 *   funcB = M.bind(funcA, obj, a, b)
		 *   funcB(c, d) // 相当于执行 funcA.call(obj, a, b, c, d)
		 * };
		 * bind = function(func, contextObj){
		 *	var args = Array.prototype.slice.call(arguments, 2);
		 *	//args = [this].extend(args);
		 *	return rebuild(func, {contextObj: contextObj, arguments: args});
		 * };
		 */
			
		bind = function(func, context, var_args) {
			var slice = Array.prototype.slice;
			var a = slice.call(arguments, 2);
			return function(){
				context = context || this;
				return func.apply(context, a.concat(slice.call(arguments)));
			};
		};
		
		var returnValue = {
			isUndefined : isUndefined,
			isNull : isNull,
			isNumber : isNumber,
			isBoolean : isBoolean,
			isString : isString,
			isObject : isObject,
			isArray : isArray,
			isArguments : isArguments,
			isFunction : isFunction,
			each : each,
			type : type,
			isType : isType,
			array : array,
			indexOf : indexOf,
			random : random,
			clone : clone,
			$try : $try,
			extend : extend,
			now : now,
			timedChunk : timedChunk,
			getLength : getLength,
			bind : bind
		};
		
		extend(this , returnValue);
		
		return returnValue;
});