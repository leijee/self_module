$(function(){
	var scrolls = new loadScroll({
		ele:".scroll-animate",//需要判断是否添加动画的dom元素
		isRepeat:true//页面回滚是否重新执行动画
	});
	scrolls.watch($('.part1-content'),function(){
		console.log('在可视区域内');
	},function(){
		console.log('在可视区域外');
	});
});
