	(function() {
		var version = "1.0",
		MUI = function(o){
			var M = this;
			if(M == window) {
				return MUI.ENV.VERSIONS[MUI.ENV.DEFAULT_VERSION];
			} else {
				M._init(o);
			}
			return M;
		};
		MUI.prototype = {
			/**
			 * MUI 的初始化方法
			 * initialize method
			 * 
			 * @private
			 * @param {Object} o config 对象
			 */
			_init : function(o){
				this.constructor = MUI;
				MUI.ENV.CONFIGS[MUI.ENV.ID] = o || {};
				MUI.ENV.INSTANCES[MUI.ENV.ID] = this;
				this.ENV = MUI.ENV;
				this.uuid = MUI.ENV.ID++;
			},
			/**
			 * 创建一个命名空间。
			 * Create a new namespace.
			 * 
			 * @since version 1.0
			 * @description 可以一次性连续创建命名空间
			 * 
			 * @param {String} name 命名空间名称
			 * @returns {Object} 返回对最末命名空间的引用
			 * 
			 * @example
			 * //在全局环境中创建mttang.com名字空间, namespace完成的操作相当于在全局环境中执行如下语句：
			 * //var mttang = {};
			 * //mttang.com = {};
			 * 
			 * M.namespace("mttang.com");
			 * 
			 * //注：参照YUI命名空间 在其YAHOO对像下创建对象
			 * 
			 */
			namespace : function(name) {
				var i,
					names = name.split("."),
					ns = MUI.ENV.NAMESPACES;

				for(i = 0; i < names.length; i=i+1){
					name = names[i];
					ns[name] = ns[name] || {};
					ns = ns[names[i]];
				}

				return ns;
			},
			/**
			 * 创建一个 Javascript 模块包
			 * 
			 * @param {String} name 要创建的包的名字空间
			 * @param {Function} func 要创建的包的包体
			 * @returns {Mixed} 返回任何自定义的变量
			 * 
			 * @example
			 * //创建一个匿名package包：
			 * MUI().add(function(M){
			 * 	//这时上下文对象this指向全局window对象
			 * 	alert("Hello world! This is " + this);
			 * };
			 * 
			 * @example
			 * //创建一个名字为mttang.com的package包：
			 * MUI().add("mttang.com", function(M){
			 * 	//这时上下文对象this指向window对象下的mttang.com对象
			 * 	alert("Hello world! This is " + this);
			 * };
			 * 
			 * 
			 * 
			 */
			add: function(){
				var name = arguments[0],
					func = arguments[arguments.length-1],
					ns = MUI.ENV.NAMESPACES,
					returnValue,
					overwrite;
					if(typeof func == "boolean") {
						overwrite = func;
						func = arguments[arguments.length - 2];
					} 
					if (typeof func === "function") {
						returnValue = func.call(this, this) || func;
						if (typeof name === "string") {
							ns.packageName = name;
							ns = this.namespace(name);
							if(MUI.ENV.PACKAGES[name]){
								if(overwrite) {
									MUI.ENV.PACKAGES[name]['returnValue'] = returnValue;
								} else {
									throw new Error("Package name [" + name + "] is exist!");
								}
							} else {
								MUI.ENV.PACKAGES[name] = {
									isLoaded: true,
									returnValue: returnValue
								};
							}
						}
					} else {
						throw new Error("Function required");
					}
					return this;
			},
			/**
			 * 创建一个 Javascript 模块包
			 * 
			 * @param {object} o 过滤的对象
			 * @returns {Mixed} 返回过滤后的对象
			 * 
			 * @example
			 * //创建一个匿名package包：
			 * MUI().add(function(M){
			 * 	//这时上下文对象this指向全局window对象
			 * 	alert("Hello world! This is " + this);
			 * };
			 * 
			 * @example
			 * //创建一个名字为mttang.com的package包：
			 * MUI().add("mttang.com", function(M){
			 * 	//这时上下文对象this指向window对象下的mttang.com对象
			 * 	alert("Hello world! This is " + this);
			 * };
			 * 
			 * 
			 * 
			 */
			filter : function(o) {
				var reg = /^_{1,2}/, p = {}, proxy = function(func, context){
					return function (){
						return func.apply(context, arguments);
					};
				};
				
				for(var i in o){
					if(!reg.test(i)){
						p[i] = proxy(o[i], o);
					}
				}
				
				return p;
			}
		},
		MUI.ENV = {
			VERSIONS : {},
			DEFAULT_VERSION : version,
			ID : 0,
			CONFIGS : {},
			NAMESPACES : {},
			PACKAGES : {},
			INSTANCES : {},
			TIME: +new Date()
		};
		var M = MUI, p = MUI.prototype, i, host = this;

		// inheritance utilities are not available yet
		for (i in p) {
			M[i] = p[i];
		}

		// set up the environment
		M._init();
		
		M.ENV.VERSIONS[version] = new MUI();
		
		host.MUI = MUI;
	})();