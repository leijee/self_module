/**
 * 原生javascript 工具包使用 
 * 核心工具(cookie操作，localStorage操作，sessionStorage操作)
 * 类型判断，dom样式操作，dom节点查找，对象深拷贝跟浅拷贝，对象类型判断
 * Bom操作，等...
 **/
(function(window,Utils){
	if(typeof define === 'function'&&define.amd){
		define(function(){return Utils})
	}else{
		window.Utils = Utils;
		return window.Utils();
	}
})(this,function(){
	var undefined = undefined;
	var _slice = Array.prototype.slice;
	var OBJ_TOSRTING = Object.prototype.toString;
	var Events = {};
	function Utils(){
		if(this instanceof Utils){
			this.on = function(e_name,func){//绑定事件
				if(!Events[e_name]){
					Events[e_name] = [];
				}
				var token = (++e_num).toString();
				Events[e_name].push({
					token:token,
					func:func
				})
				return token;
			}
			this.trig = function(e_name,args){//触发事件
				if(!Events[e_name]){
					return false;
				}
				var ev_names = Events[e_name];
				var len = ev_names.length;
				if(len>0){
					while(len--){
						Events[e_name][len].func(args);
					}
				}
				return true;
			}
			this.off = function(token){//通过on方法返回的token值来移除事件
				for(var o in Events){
					if(Events[o]){
						for(var i=0,len=Events[o].length;i<len;i++){
							if(Events[o][i].token === token){
								Events[o].splice(i,1);
								return token;
							}
						}
					}
				}
				return false
			}
			//解码
			this.decode = function(str){
				return decodeURIComponent(str);
			}
			this.getQueryString = function(str){//获取url上params参数值
				var params = location.search;//?a=name&b=test
				var newparams = params.substr(1);
				var arr1 = newparams.split('&');
				for(var i=0,len=arr1.length;i<len;i++){
					var key = arr1[i].sp
					lit('=')[0];
					var value = arr1[i].split('=')[1];
					if(key == _this.decode(str)){
						return value;
					}
				}
			}
			this.UA = (function(){
				var ua = navigator.userAgent.toLowerCase();
				var reg = {
					iphone:'',
					ios:'',
					android:'',
					pc:'',
					weichat:'',
					qq:''
				};
				return {
					isIphone:function(){
						return reg.iphone.test(ua);
					},
					isIos:function(){
						return reg.ios.test(ua);
					},
					isAndroid:function(){
						return reg.android.test(ua);
					},
					isPc:function(){
						return reg.pc.test(ua);
					},
					isWeiChat:function(){
						return reg.weichat.test(ua);
					},
					isQQ:function(){
						return reg.qq.test(ua);
					}
				}
			})();
			//cookie操作
			this.Cookies = (function(){
				return {
					getItem: function (sKey) {
					    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
					  },
					setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
					    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
					    var sExpires = "";
					    if (vEnd) {
					      	switch (vEnd.constructor) {//构造器属性
						        case Number:
						          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
						          break;
						        case String:
						          sExpires = "; expires=" + vEnd;
						          break;
						        case Date:
						          sExpires = "; expires=" + vEnd.toUTCString();
						          break;
						        defaul:
						            break;
					     	}
					    }
					    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
					    return true;
					},
					removeItem: function (sKey, sPath, sDomain) {
					    if (!sKey || !this.hasItem(sKey)) { return false; }
					    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
					    return true;
					},
					hasItem: function (sKey) {
					    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
					},
					keys:function () {
					    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
					    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
					    return aKeys;
					}
				}
			})();


			var c_storage = {
				getItem: function (sKey) {
	                if(!sKey || !this.hasOwnProperty(sKey)) { return null; }
	                return unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
	            },
	            key: function (nKeyId) {
	                return unescape(document.cookie.replace(/\s*\=(?:.(?!;))*$/, "").split(/\s*\=(?:[^;](?!;))*[^;]?;\s*/)[nKeyId]);
	            },
	            setItem: function (sKey, sValue) {
	                if(!sKey) { return; }
	                document.cookie = escape(sKey) + "=" + escape(sValue) + "; expires=Tue, 19 Jan 2038 03:14:07 GMT; path=/";
	                this.length = document.cookie.match(/\=/g).length;
	            },
	            length: (function(){
	                return (document.cookie.match(/\=/g) || window.localStorage).length;
	            })(),
	            removeItem: function (sKey) {
	                if (!sKey || !this.hasOwnProperty(sKey)) { return; }
	                document.cookie = escape(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
	                this.length--;
	            },
	            hasOwnProperty: function (sKey) {
	                return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	            }
			}


			//操作localstorage
			this.l_storage = (function(){
			    if(typeof window.localStorage != 'object'){
			        return c_storage;
			    }else{
			    	return {
				        setItem:function(key,value){
				            window.localStorage.setItem(key,value);
				        },
				        getItem:function(key){
				            return window.localStorage.getItem(key);
				        },
				        removeItem:function(key){
				            window.localStorage.removeItem(key);
				        },
				        removeAll:function(){
							window.localStorage.clear();
				        },
				        length:(function(){
				        	return window.localStorage.length;
				        })()
				    }
			    }
			    
			})();
			//操作sessionstorage
			this.s_storage = (function(){
			    if(!window.sessionStorage){
			        return c_storage;
			    }
			    return {
			        setItem:function(key,value){
			            window.sessionStorage.setItem(key,value);
			        },
			        getItem:function(key){
			            return window.sessionStorage.getItem(key);
			        },
			        removeItem:function(key){
			            window.sessionStorage.removeItem(key);
			        },
			        removeAll:function(){
						window.sessionStorage.clear();
			        },
			        length:(function(){
			        	return window.sessionStorage.length;
			        })()
			    }
			})();
			//html5 浏览器数据库操作
			this.dataBase = (function(){
				var db = null;//数据库
				var hasCreate = false;//表
				function openDatabase(name,version,detail,maxSize){//创建数据库或者打开数据
					db = window.openDatabase(name,version,detail,maxSize);
				}
				//"create table test (id int UNIQUE, mytitle TEXT, timestamp REAL)"
				function createDatasheet(command){//创建数据表
					if(db != null){
				        db.transaction(function(tx){
				        	hasCreate = true;
				            tx.executeSql(command);
				        }); 
					}else{
						throw new Error("数据库不存在，请先创建数据库或者打开数据库");
						return ;
					}
				}
				//"INSERT INTO test (id, mytitle, timestamp) values(?, ?, ?)", [2, "DaWanGanBan", new Date().getTime()], null, null
				function operateDatasheet(command,dataArr,s_fun,e_fun){//操作数据库，增删改查功能
					if(db == null){
						throw new Error("数据库不存在，请先创建数据库或者打开数据库");
						return ;
					}else{
						db.transaction(function(tx) {
					 		tx.executeSql(command, dataArr , s_fun, e_fun);
						});
					}
				}
				return {
					createDataBase:openDatabase,
					createDatasheet:createDatasheet,
					operateDatasheet:operateDatasheet,
				}
			})();
			/**
			 *将对象转换成指定格式的字符串如：a=123&b=234 
			 **/
			this.objData = function(obj){
				
				if(!isObject(obj)){
					throw new Error('obj is not Object'); 
				}
				var dataArr =[];
				for(var i in obj){
					var dataStr =i+'='+obj[i];
					dataArr.push(dataStr);
				}
				return dataArr.join('&');
			}
			//编码
			this.encode = function(str){
				return encodeURIComponent(str);
			}
			/**
			 *添加class 
			 **/
			window.addClass = this.addClass = function(ele,className){
				if(!this.hasClass(ele,className)){
					ele.className += " " + className;  
				}
			}
			/**
			 *移除class 
			 **/
			this.removeClass = function(ele,className){
				if(this.hasClass(ele,className)){
					var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
					ele.className = ele.className.replace(reg,'');
				}
			}
			//判断是否一个整数
			window.isNumber = this.isNumber = function(num){
				return typeof(num)== 'number'&&num%1 === 0;
			}
			/**
			 * 对象obj是否含有自身属性prop 
			 **/
			this.hasProp = function(obj,prop){
				return Object.prototype.hasOwnProperty.call(obj,prop);
			}
			//遍历自身属性 func两个参数分别是:(key,value)
			this.eachProp = function(obj,func){
				for(var prop in obj){
					if(this.hasProp(obj,prop)&&func(prop,obj[prop])){
						break;
					}
				}
			}
			this.sortBy = function(arr,condition){
				var len = arr.length;
				var newArr = [];
				
				for(var i=0;i<len;i++){//比较条件值
					arr[i][condition]
				}
				
				
				
				return new Arr;
			}
			
			/**
			 * bind方法将func方法绑定到obj对象上 
			 **/
			this.bind = function(obj,func){
				return function(){
					return func.apply(obj,arguments);
				}
			}
			/**
			 * 返回自身属性值 value
			 **/
			this.getOwn = function(obj,prop){
			    return this.hasProp(obj,prop)&&obj[obj];
			}
			/**
			 * obj对象中的属性是否可枚举 
			 **/
			this.isEnumer = function(obj,prop){
				return obj&&obj.propertyIsEnumerable(prop);
			}
			
			/**
			 *判断option对象是否为空 
			 **/
			window.isEmptyObject = this.isEmptyObject= function(option){
				var obj = option;
				for(var i in obj){
					return false;
				}
				return true;
			}
			
			/**
			 * 常用对象判断 isArray isFunction isObject isNumber isBoolean isString isRegExp
			 **/
			(function objJudgment(window){
				var objArr = ['Array','Function','Object','Number','Boolean','String','RegExp'];
				objArr.forEach(function(obj,i){
				    window["is"+obj] = function(currObj){
				        return Object.prototype.toString.call(currObj) === "[object "+obj+"]";
				    }
				})
			}(window));

			/**
			 * 判断obj是否为一个真实对象
			 **/
			window.isPlainObject = function(obj) {
			    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
			}
			/**
			 * 是否存在class 
			 **/
			window.hasClass = this.hasClass = function(ele,className){
				return ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
			}
			/**
			 * dom节点操作 
			 **/
			window.siblings = function(elem){
				var n = (elem.parentNode||{}).firstChild;
				var elemArr = [];
				var sibs = function(n,elem){
					for(;n;n = n.nextSibling){
						if(n.nodeType ===1&&n!==elem){
							
							elemArr.push(n);
						}
					}
					return elemArr;
				}
				return sibs(n,elem);
			}
			/**
			 *设置样式 
			 **/
			window.setStyle = function(ele,option){
				for(var i in option){
					ele.style[i] = option[i];
				}
			}
			/**
			 *获取样式 
			 **/
			window.getStyle = function(ele,attr){
				if(ele.currentStyle){  
			        return obj.currentStyle[attr];  
			    } else{  
			        return getComputedStyle(ele,false)[attr];  
			    }  
			}
			//dom选择器
			window.$$ = function(){
				var _selectors = doc.querySelectorAll(selector);
				return _slice.call(_selectors);
			}
			//id选择器
			window.$id = function(elementStr){
				if(typeof elementStr != 'string'){
					return null;
				}
				return doc.getElementById(elementStr);
			}
			//文档dom元素加载完成之后执行callback函数
			window.$ready = function(callback){
				if ('addEventListener' in document) {
					document.addEventListener('DOMContentLoaded', function() {
						callback();
					}, false);
				}	
			}
			
			//字符串连接
			window.concat = function(a,b){
				return a?b?(a+''+b):a:(b||'');
			}
			
			
			
			/**
			 *实现对象复制
			 **/
			 window.s_extend = function(target,option,deep){
				var deep = false;
				var clone;
				
				if(deep == 'undefined' || deep == null){
					deep = false;
				}
				for(var name in option){
					var scr = target[name];
					var copy = option[name];
					if(!deep){//浅复制
						target[name] = option[name];
					}else{//深复制
						if(target === copy){
							continue;
						}
						if(isArray(copy)&&isPlainObject(copy)){
							if(isArray(copy)){//如果是数组的话就直接替换
								clone = src && isArray( src ) ? src : [];
							}else if(isPlainObject(copy)){//如果是对象的话
								clone = src && isObject( src ) ? src : {};
							}
							target[name] = s_extend(clone,copy,deep);
						}else{
							target[name] = copy;
						}
					}
				}
				return target;
			}
			/**
			 *抛出错误信息 
			 **/
			window.throwError = function(msg){
				throw Error(msg);
			}
			/**
			 * 判断是否支持某样式 
			 **/
			window.isExsitCssStyle = function(styleName){
				if(styleName in document.documentElement.style){
					return true;//存在
				}
				return false;//不存在
			}
		}else{
			return new Utils();
		}
	}
	return Utils();
	//数字数组排序（由小到大）
	Array.prototype.sort = function(){
		var newArr = this;
		var len = newArr.length;
		for(var i=0;i<len-1;i++){
			for(var j=i+1;j<len;j++){
				if(oldArr[j]<oldArr[i]){
					var temp;
					temp = oldArr[i];
					oldArr[i]=oldArr[j];
					oldArr[j]=temp;
				}
			}
		}
		return newArr;
	}
	/**
	 * 使用each方法遍历数组，返回当前数组 
	 * func三个参数分别是(数组下标对应的元素,数组下标,当前数组 )
	 **/
	Array.prototype.each = function(){
		var len =this.length;
		for(var i=0;i<len;i++){
			if(this[i]&&func(this[i],i,this)){
				break;
			}
		}
		return this;
	}
	/**
	 *eachReverse方法逆向遍历数组元素，并且在func中返回相关的数据
	 * func三个参数分别是 (数组下标对应的元素,数组下标,当前数组 )
	 **/
	Array.prototype.eachReverse = function(arr,func){
		var i=arr.length-1;
		for(;i>-1;i--){
			if(this[i]&&func(this[i],i.this)){
				break;
			}
		}
		return this;
	}
	/**
	 * 移除数组中指定位置 
	 **/
	Array.prototype.deleteIndex = function(index){
		var len = this.length;
		var index = index;
		if(index>len-1){//下标超过数组最大值的时候，移除最后一个
			index =  len-1;
		}
		if(index<0&&Math.abs(index)>len-1){
			index = 0;
		}
		return this.splice(index,1);
	}
	//将array转换成string对象
	Array.prototype.toString = function(){
	    return this.join('');
	}
	//移除数组中指定的值
	Array.prototype.remove = function(item){
		if(this.length){
			var i = this.indexOf(item);
			if(i>-1){
				return this.splice(i,1);
			}
		}
	}
	//获取数字数组中最大的数
	Array.prototype.max = function(){
		var newArr = this.sort();
		var len = newArr.length;
		return newArr[len-1];
	}
	//获取数字数组中最小的数
	Array.prototype.min = function(){
		var newArr = this.sort();
		return newArr[0];
	}
	//给数组元素自定义filter方法
	Array.prototype.filter = function(func){
		var itemLen = this.length;
		var newArr = [];
		if(itemLen){
			for(var i=0;i<itemLen;i++){
				func(this[i]);
			}
		}
	}
	
	/**
	 *给字符串添加一个倒序的方法 
	 * this.split('') 将当前字符串转换成一个数组，调用数组的reverse方法，将数组倒序排列，倒序之后
	 * 使用join('')方法，将数组转换成字符串
	 **/
	String.prototype.reverse = function(){
		return Array.prototype.reverse.call(this.split('')).join('');
	}
	/**
	 *将string类型转换成array类型 
	 **/
	String.prototype.toArray = function(){
		try{
			return Array.prototype.slice.call(this);
		}catch(e){
			var arr = [];
			for(var i =0;i<this.length;i++){
				arr[i] = this[i];
			}
			return arr;
		}
	}
	/**
	 * 给Date对象添加一个format方法 
	 **/
	
	//new Date().format("yyyy-mm-dd hh:mm:ss");
	//new Date().format("yyyy/mm/dd hh:mm:ss");
	Date.prototype.format = function(fmt){
		var o = {
	        "M+": this.getMonth() + 1, //月份 
	        "d+": this.getDate(), //日 
	        "h+": this.getHours(), //小时 
	        "m+": this.getMinutes(), //分
	        "s+": this.getSeconds(), //秒 
	        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
	        "S": this.getMilliseconds() //毫秒 
	    };
		if (/(y+)/.test(fmt)||/(Y+)/.test(fmt)){
			fmt = fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
		}
	    for (var k in o){
	    	if (new RegExp("(" + k + ")").test(fmt)){
		    	fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		    }
	    }
	    return fmt;
	}
	var t3 = new Date("2016/12/13").format("yyyy-M-dd");
});
