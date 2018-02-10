(function(window){
	//是否是数组对象
	function isArray(obj){
		return Object.prototype.toString.call(obj) === "[object Array]";
	}
	//是否为对象
	function isObject(obj){
		return Object.prototype.toString.call(obj) === "[object object]";
	}
	//是否为window对象
	function isWindow(obj){
		return obj != null && obj == obj.window
	}
	//是否是一个真实对象
	function isPlainObject(obj) {
	    return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype
	}
	//获取元素css样式
	function getStyle(obj,property){
		if(!obj){
			new Error("传入的不是一个dom元素对象");
			return ;
		}
		if(obj.currentStyle){
			return obj.currentStyle[property];
		}else{
			return window.getComputedStyle(obj,null)[property];
		}
	}
	//设置元素css样式
	function setStyle(obj,key,property){
		obj.style[key] = property;
	}
	//遍历所有的兄弟元素
	function siblings(obj,glob){
		var eles = document.querySelectorAll(glob);
		var sibArr = [];
		if(!obj){
			new Error("传入的不是一个dom元素对象")
		}
		obj.parentNode.childNodes.forEach(function(o){
			if(eles&&eles.length>0){
				eles.forEach(function(e){
					if(o.nodeType == 1&& o!==obj&&o == e){
						sibArr.push(o);
					}
				})
			}else{
				if(o.nodeType == 1&& o!==obj){
					sibArr.push(o);
				}
			}
		});
		return sibArr;
	}
	function $$(ele){
		return document.querySelector(ele);
	}
	function _extend(target,option,deep){
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
					target[name] = _extend(clone,copy,deep);
				}else{
					target[name] = copy;
				}
			}
		}
		return target;
	}
	
	/**
	 * 移动端自定义滚动条
	 **/
	function ScrollBar(ele,options){
		this.ele = ele;//当前滚动元素
		
		this.$addBarEle = $$(options.addBar);//添加滚动条元素
		this.options = _extend({
			parents:'.scroll'
		},options);
		this.curX = 0;//移动barX的距离
		this.curY = 0;//移动barY的距离
		this.etx = 0;//当前bar停留位置X轴坐标
		this.ety = 0;//当前bar停留位置Y轴坐标
		this.stx = 0;//手指停留位置x轴坐标
		this.sty = 0;//手指停留位置y轴坐标
		this.boxWidth = 0;//当前滚动元素的父类宽度
		this.boxHeight = 0;
		this.scrollWidht = 0;//当前元素宽度
		this.scrollHeight = 0;
		this.translateX = 0;
		this.translateY = 0;
		this.$xbarX = null;
		this.$ybarY = null;
		this.barXwidth = 0;
		this.barYHeight = 0;
		
		this.isxBar = false;//当前是否为xbar
		this.isyBar = false;//当前是否为ybar
		
		this.radio = 1;
		this.radioY = 1;
		
		this.isload = false;//生命周期 bar渲染完成
		
		var _this = this;
		var img = new Image();
		if(this.isImg()){
			img.src = this.ele.getAttribute("src");
			img.onload = function(){
				_this.init();
			}
		}else{
			this.init();
		}
		window.onresize = function(){
			setTimeout(function(){
				_this.init();
			},50);
		}
	}
	ScrollBar.prototype.isImg = function (){//当前元素是否为IMG
		if(this.ele.nodeName == 'IMG'){
			return true;
		}
		return false;
	}
	ScrollBar.prototype.init = function(){//初始化
		var parents = this.options.parents;//当前元素父类元素class
		var ele = this.ele;//当前元素
		var boxWidth = parseInt(getStyle(ele.parentNode,"width"));//当前滚动元素的父类宽度
		var boxHeight = parseInt(getStyle(ele.parentNode,"height"));//当前滚动元素的父类高度
		var scrollWidht = parseInt(getStyle(ele,"width"));//当前元素宽度
		var scrollHeight = parseInt(getStyle(ele,"height"));//当前元素高度
		var $barX,
			$barY,
			barXwidth,
			barYHeight,
			xbarwidth,
			ybarheight,
			barValueX,
			barValueY;
		this.boxWidth = boxWidth;//当前滚动元素的父类宽度
		this.boxHeight = boxHeight;//当前滚动元素的父类高度
		this.scrollWidht = scrollWidht;//当前元素宽度
		this.scrollHeight = scrollHeight;//当前元素高度
		
		if(!this.checkIsScroll()){//自动检测添加滚动条
			return ;
		}
		this.translateX = scrollWidht - boxWidth;
		this.translateY = scrollHeight - boxHeight;
		
		$barX = siblings(ele.parentNode,".x-bar")[0];//Xbar轴
		$barY = siblings(ele.parentNode,".y-bar")[0];//Ybar轴
		
		this.$xbarX = $barX.firstChild;//Xbar滚动轴
		this.$ybarY = $barY.firstChild;//Ybar滚动轴
		
		barXwidth = parseInt(getStyle($barX,"width"));
		barYHeight = parseInt(getStyle($barY,"height"));
		xbarwidth = parseInt(getStyle(this.$xbarX,"width"));
		ybarheight = parseInt(getStyle(this.$ybarY,"height"));
		barValueX = barXwidth-xbarwidth;
		barValueY= barYHeight-ybarheight;
		
		this.radio = parseFloat(barValueX/this.translateX);
		this.radioY = parseFloat(barValueY / this.translateY);
		this.addEvent();
	}
	ScrollBar.prototype.addEvent = function(){//添加事件
		var _this = this;
		var moveX = 0;//横向手指移动的距离
		var moveY = 0;//纵向手指移动的距离
		var scrollType = this.options.typeBar;
		var curX = 0;
		var curY = 0;
		this.ele.addEventListener("touchstart",function(){
			moveX = 0,moveY = 0;
		    // 元素当前位置
		    _this.etx = _this.getT3d(_this.ele, "x");
		    _this.ety = _this.getT3d(_this.ele, "y");
		    // 手指位置
		    _this.stx = event.touches[0].pageX;
		    _this.sty = event.touches[0].pageY;
		});
		this.ele.addEventListener("touchmove",function(event){
			var e = event||window.event;
			// 防止拖动页面
		    e.preventDefault();
		    moveX = e.touches[0].pageX - _this.stx;
		    moveY = e.touches[0].pageY - _this.sty;
		    
		    // 目标位置 就是 要移动的距离 加上 元素当前位置
		    curX = moveX + _this.etx;
		    curY = moveY + _this.ety;
			if(curX<0){
				if(Math.abs(curX)>_this.translateX){
					curX = -_this.translateX;
				}else{
					curX = curX;
				}
			}else {//最左端不可移动
				curX = 0;
			}
			if(curY<0){
				if(Math.abs(curY)>_this.translateY){
					curY = -_this.translateY;
				}else{
					curY = curY;
				}
			}else{
				curY = 0;
			}
			if(scrollType == "auto"){
				_this.translateEle(curX,curY);
				_this.translateToX(curX);
				_this.translateToY(curY);
			}
			if(scrollType == "ybar"){
				_this.translateEle(0,curY);
				_this.translateToY(curY);
			}
			if(scrollType == "xbar"){
				_this.translateEle(curX,0);
				_this.translateToX(curX);
			}
		});
		this.ele.addEventListener("touchend",function(){
			_this.etx = curX;
		    _this.ety = curY;
		});
	}
	//xbar滑动到指定位置
	ScrollBar.prototype.translateToX = function(value){
		this.$xbarX.style.webkitTransform = 'translate3d(' + value*-this.radio + 'px, ' + 0 + 'px,0px)';
	}
	//ybar滑动到指定位置
	ScrollBar.prototype.translateToY = function(value){
		this.$ybarY.style.webkitTransform = 'translate3d(' + 0 + 'px, ' + value*-this.radioY + 'px,0px)';
	}
	//当前元素滑动到指定位置
	ScrollBar.prototype.translateEle = function(x,y){
		this.ele.style.webkitTransform = 'translate3d(' + x + 'px, ' + y + 'px,0px)';
	}
	
	ScrollBar.prototype.checkIsScroll = function(){//判断是否需要添加滚动条
		var xnode = document.createElement('div');
		var ynode = document.createElement('div');
		xnode.setAttribute("class","x-bar");
		ynode.setAttribute("class","y-bar");
		ynode.innerHTML = xnode.innerHTML = '<div class="bar"></div>';
		
		var _this = this;
		var addBarHtml = function(node){
			_this.$addBarEle.appendChild(node);
			_this.isload = true;
		}
		this.flag =(this.scrollWidht>this.boxWidth||this.scrollHeight>this.boxHeight)?true:false;//是否需要滚动
		if(this.options.typeBar == 'xbar'){
			if(this.scrollWidht>this.boxWidth){//当前元素的宽度大于父元素的宽度时，添加滚动条
				addBarHtml(xnode);
				this.isxBar = true;
			}
		}else if(this.options.typeBar == 'ybar'){
			if(this.scrollHeight>this.boxHeight){//当前元素的宽度大于父元素的宽度时，添加滚动条
				addBarHtml(ynode);
				this.isyBar = true;
			}
		}else if(this.options.typeBar == 'auto'){//自动检测是否需要添加滚动条
			if(this.scrollWidht>this.boxWidth){//当前元素的宽度大于父元素的宽度时，添加滚动条
				addBarHtml(xnode);
				this.isxBar = true;
			}
			if(this.scrollHeight>this.boxHeight){
				addBarHtml(ynode);
				this.isyBar = true;
			}
		}else{
			this.isxBar = false;
			this.isyBar = false;
			throw new Error("typeBar's value must be \'xbar,ybar,auto\'");
			flag =  false;
		}
		return this.flag;
	}
	ScrollBar.prototype.getT3d = function(elem, ename){//获取translate值
		var str1 = elem.style.webkitTransform;
	    if (str1 == "") return 0;
	    var currVal = 0;
	    str1 = str1.replace("translate3d(", "");
	    str1 = str1.replace(")", "");
	    var carr = str1.split(",");
	    if (ename == "x"){
	    	currVal = carr[0];
	    }else if (ename == "y"){
	    	currVal = carr[1];
	    }else if (ename == "z"){
	    	 currVal = carr[2];
	    }
	    return parseInt(currVal);
	}
	
	ScrollBar.prototype.onloaded = function(callback){//初始化完成
		var timers = null;
		var _this = this;
		timers = setInterval(function(){
			if(_this.isload){
				clearInterval(timers);
				callback();
			}
		},10);
	}
	
	//滚动到指定位置
	ScrollBar.prototype.scrollTo = function(x,y){
		var _this = this;
		this.onloaded(function(){
			if(_this.isload){//存在滚动
				if(_this.isxBar&&_this.isyBar){//xbar&&ybar都存在
					_this.translateToX(x);
					_this.translateToY(y);
					_this.translateEle(x,y);
					return ;
				}else if(_this.isxBar){//只存在xbar
					_this.translateToX(x);
					_this.translateEle(x,y);
				}else if(_this.isyBar){//只存在ybar
					_this.translateToY(y);
					_this.translateEle(x,y);
				}else{//xbar或者y都不存在
					console.info('无法移动')
				}
			}		
		});
	}
	ScrollBar.prototype.SetBarStyle = function(options){//设置滚动条颜色
		
	}
	window.ScrollBar = ScrollBar;
})(window);
