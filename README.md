#scrollBar(移动端自定义滚动条)
### 使用方式
     var bar = new ScrollBar(ele,{ //ele当前滑动元素
		addBar:'.auto-scroll',//添加滚动条html代码dom节点
		parents:'.scroll',//当前滚动元素父级元素
		typeBar:'auto'//自动添加bar,三个参数xbar,ybar,auto
	 });
	 //scrollTo函数滚动到指定位置
	 bar.scrollTo(-200,-50);//scrollTo(x,y)滚动到指定位置
### api说明
#### new ScrollBar(ele,options) 
	ele当前dom对象
    options 参数
    {
		addBar:'.auto-scroll',//添加滚动条html代码dom节点
		parents:'.scroll',//当前滚动元素父级元素
		typeBar:'auto'//自动添加bar,三个参数xbar,ybar,auto
    }

   函数
	scrollTo(x,y) 将当前目标元素滚动到指定的位置，同时xbar或者ybar移动到相应的位置
   	
#scrollAnimate (PC端鼠标滚动，自动加载动画)
### 使用方式
	
	<!--在head中引入对应动画css文件-->
	<head>
		<style href="./css/animate.css"></style>
	</head>
	
	<!--html中使用方法如：-->
	<div class="part1">
    	<div top-scroll="0" bottom-scroll="0" class="part1-content scroll-animate lazy">
    		<img class="part1-title zoomIn ani-1" src="img/part1_title1.png" alt="" />
        	<img class="part1-little-title fadeInUp ani-2" src="img/part1_little_title.png"/>
        	<span class="part1-arrow"></span>
    	</div>
    </div>
	<!--在一个div块中，需要同级子元素判断进入到可视区域后，依次执行动画的话，在当前块添加对应的scroll-animate类名，还需添加一个lazy类，然后在需要执行动画的dom元素上添加动画class如：zoomIn 以及添加动画执行延迟时间类：ani-1 -->
	

	<div class="part2">
    	<h1 top-scroll="100" bottom-scroll="300" class="section-title title1 scroll-animate fadeInDown ani-1"><i class="title-icon-left"></i><span>什么是股指期货</span><i class="title-icon-right"></i></h1>
    	<p top-scroll="500" bottom-scroll="500" class="title-text scroll-animate fadeInUp ani-1">股指期货（指数期货）是金融期货（Financial Futures）中的一种类型，是以股票指数为标的物的金融期货合约。主要分为IF,IH,IC三种指数。</p>
    </div>
	<!--在一个div块中，只判断当前元素进入可视区域后，执行动画的话，只需在当前块添加对应的scroll-animate类名以及动画class如：fadeInDown 和添加动画执行延迟时间类：ani-1 -->
	
	<!--top-scroll:鼠标向下滚动，执行的动画块从底部进入可视区域超出高度时执行动画,bottom-scroll：鼠标向上滚动，执行的动画块从顶部进入可视区域超出高度时执行动画-->

	在</body>前引入相关js文件
    <script src="./js/jquery-1.12.3.min.js"></script>
	<script src="./js/scrollAnimate.js"></script>
	<script>
		$(function(){
			var scrolls = new loadScroll(".scroll-animate");//.scroll-animate需要添加动画的dom对应的class
			scrolls.watch($('.part1-content'),function(){//.part1-content监听添加滚动动画的dom是否进入可视区域
				console.log('在可视区域内');
			},function(){
				console.log('在可视区域外');
			});
		});
	</script>
#utils (原生javascript 工具包)
### 使用说明
    /**
	 * 原生javascript 工具包使用 
	 * 核心工具(cookie操作，localStorage操作，sessionStorage操作)
	 * 类型判断，dom样式操作，dom节点查找，对象深拷贝跟浅拷贝，对象类型判断
	 * Bom操作，等...
	 **/
	</body>前引入<scirpt src="utils.js"></script>
	var util = new Utils();
	console.log(util);//通过打印util查看已添加的相关方法
	
	/**
	 * window上的全局方法
	 **/
	$$("#test")//原生querySelectAll获取dom
	$id("test")//id选择器
	$ready(function(){//html节点加载完成之后的回调函数
		console.log("html节点加载完成");
	})
	checkIsImg(eleObj)//判断当前元素是否为img对象，返回boolean值
	imgLoaded(eleObj,callback)//img标签上的图片加载完成之后执行callback
	s_extend(target,obj1,true)//obj1对象继承到target对象，return一个新的对象
	isExsitCssStyle(styleName)//判断是否支持css样式
	isArray(obj) //对象是否为数组类型
	isFunction(obj) //对象是否为函数类型
	isObject(obj) //对象是否为Object类型
	isNumber(obj) //对象是否为Number类型
	isBoolean(obj) //对象是否为布尔类型
	isString(obj) //对象是否为String类型
	isRegExp(obj)//对象是否为RegExp类型
	isDate(obj) //对象是否为Date类型
	isEmptyObject(obj) //当前obj对象上是否存在属性
	isPlainObject(obj) //是否为一个真实对象
	siblings(eleObj) //获取当前dom节点对象的兄弟节点,return数组类型 
	setStyle(eleObj,option)//为eleObj元素设置样式 option为key:value对象
	getStyle(eleObj,key)//获取eleObj元素上的key样式值
	
	/**
	 * Array上的全局方法
	 **/
	[3,4,1,2].sort()或者[3,4,1,2].sort(false)//数字数组排序（由小到大）return 一个新的数组
	[3,4,1,2].sort(true)//数字数组排序（由大到小）return 一个新的数组\
	
	arr.each(function(obj,i,this){})//正向遍历数组
	arr.eachReverse(function(obj,i,this){}) //反向遍历数组
	
	/**
	 * String上的全局方法
	 **/
	"hello world".reverse()//"dlrow olleh" 字符串反转
	"hello world".toArray()//["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]字符串转成数组
	"hello world".UpWord()//Hello world字符串首字母大写
	"hello world".UpWord(true)//Hello World字符串所所有单词首字母大写
	/**
	 * Date上的全局方法
	 **/
	new Date("2016/12/13").format("yyyy-M-dd")//日期格式化