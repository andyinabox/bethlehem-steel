define([
	'jquery',
	'lodash',
	'skrollr',
	'app/preloader',
	'app/skrollr-media'
], function($, _, skrollr, preloader, skrollrMedia) {
	var _skrollr;

	preloader.init().then(function(e){
		console.log("loaded!", e);
		
		$('.fullscreen').height($(window).height());
		_skrollr = skrollr.init();
		skrollrMedia.init(_skrollr);

		$('#content').show();
		$('#loading').hide();

	});

});