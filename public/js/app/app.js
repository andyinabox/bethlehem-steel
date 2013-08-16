define([
	'jquery',
	'lodash',
	'skrollr',
	'app/preloader'
], function($, _, skrollr, preloader) {


	preloader.init().then(function(e){
		console.log("loaded!", e);
		$('#content').show();
		$('#loading').hide();


		$('video').each(function(index, el){
			console.log('video', el);
			el.play();
		});


		$('audio').each(function(index, el){
			console.log('audio', el);
			el.play();
		});
	});

});