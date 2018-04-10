$(function(){
	var scrolls = new loadScroll(".scroll-animate");
	scrolls.watch($('.part1-content'),function(){
		console.log('在可视区域内');
	},function(){
		console.log('在可视区域外');
	});
});
