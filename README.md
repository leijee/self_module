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
   	