(function(window){
	/*滚动加载动画*/
	function loadScroll(options) {
	    this.$ele = $(options.ele),
	    this.winScrollTop = 0,
	    this.winHeight = $(window).height(),
	    this.halfHeight = this.winHeight / 2,
	    this.autoPlay = false,
	    this.playObj = null,
	    this.options = options;

	    this.isShow = function($ele, mainOffsetTop, mainHeight, topval, bottomval) { //是否在指定的可视区域内
	        var winScrollTop = $(window).scrollTop() || $(document).find("body").scrollTop();
	        if (this.winHeight + winScrollTop > mainOffsetTop + topval && mainOffsetTop + mainHeight > winScrollTop + bottomval) {
	            $ele.css("opacity", 1).addClass("animated");
	            return true;
	        } else {
	            if (this.options && this.options.isRepeat === true) { //页面回滚执行动画
	                $ele.css("opacity", 0).removeClass("animated");
	            }
	        }
	    },
	    this.eleArr = [],
	    
	    
	    //执行动画
	    this.init();
	}
	function getEleTop($ele) { //获取元素距离文档顶部的距离
        var topVal = $ele.offset().top;
        return topVal;
    }	
	function getEleHeight($ele) { //获取元素的高度
        var heightVal = $ele.height();
        return heightVal;
    }
	/**
	 * [init 初始化]
	 */
	loadScroll.prototype.init = function() { //默认初始化数据
        var _this = this;
        $.each(this.$ele, function(index, obj) {
            var eleObj = {
                eles: obj,
                eleTop: getEleTop($(obj)),
                eleHeight: getEleHeight($(obj)),
                topScroll: parseInt($(obj).attr("top-scroll")) || 200, //底部模块突出在可视区域的距离(鼠标向下滚动)
                bottomScroll: parseInt($(obj).attr("bottom-scroll")) || 200 //顶部模块突出在可视区域的距离(鼠标向上滚动)
            }
            _this.eleArr.push(eleObj);
        });
        this.toScroll();
    }
    loadScroll.prototype.toScroll = function(callback) {
        var _this = this;
        $(document).on("scroll", function(e) {
            _this.load(_this);

            if (typeof callback == 'function') {
                callback();
            }
        }).trigger("scroll");
    }
	loadScroll.prototype.load = function(_this) {
	    var _this = this;
	    this.eleArr.forEach(function(eleObj) {
	        var obj = eleObj.eles;
	        var _top = eleObj.eleTop;
	        var _height = eleObj.eleHeight;
	        var _topval = eleObj.topScroll;
	        var _bottomval = eleObj.bottomScroll;
	        if (obj.nodeName.toLocaleLowerCase() == 'img') {
	            var img = new Image();
	            img.src = $(obj).attr("src");
	            if (img.complete) { // 如果图片已经存在于浏览器缓存，直接调用回调函数
	                _this.isShow($(obj), _top, _height, _topval, _bottomval);
	                return; // 直接返回，不用再处理onload事件
	            }
	            img.onload = function() { //图片下载完毕时异步调用callback函数。
	                _this.isShow($(obj), _top, _height, _topval, _bottomval);
	            };
	        } else {
	            _this.isShow($(obj), _top, _height, _topval, _bottomval);
	        }
	    });
	}
	/**
	 * 滚动到指定区域之后，触发某方法
	 * @param ele[监听元素] inCallback][进入指定区域执行的callback] outCallback[离开指定区域执行的callback]
	 * @return true
	 */
	var inFlag = true;
	var outFlag = true;
	loadScroll.prototype.watch = function(ele, inCallback, outCallback) {
	    var _this = this;
	    var flag = false;
	    if (typeof ele == 'object') {
	        this.toScroll(function() {
	            flag = _this.isShow(ele, getEleTop(ele), getEleHeight(ele), parseInt(ele.attr("top-scroll")) || 200, parseInt(ele.attr("bottom-scroll")) || 200);
	            if (flag) {
	                if (inFlag) {
	                    inCallback();
	                    inFlag = false;
	                    outFlag = true;
	                }
	            } else {
	                if (outFlag) {
	                    outCallback();
	                    outFlag = false;
	                    inFlag = true;
	                }
	            }
	        })
	    }
	    return true;
	}

	//判断当前设备是否为移动端
	function isMobil() {
	    var reg = /android|iphone|iPad/gi;
	    var ua = window.navigator.userAgent;
	    if (reg.test(ua)) {
	        return true;
	    }
	    return false;
	}

	window.loadScroll = loadScroll;
})(window);