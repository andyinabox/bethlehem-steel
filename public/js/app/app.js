define([
	'jquery',
	'lodash',
	'skrollr',
	'mediator-js', 
	'app/preloader',
	'app/skrollr-media',
	'app/dev'
], function($, _, skrollr, mediator, preloader, skrollrMedia, dev) {
	var _m = new Mediator(),
		_skrollr;

	dev.init({}, _m);

	_m.subscribe('preloader:progress', function(e) {
	
	});

	preloader.init({},_m).then(function(e){
		console.log("loaded!", e);
		
		$('.fullscreen').height($(window).height());
		_skrollr = skrollr.init();
		dev.setSkrollr(_skrollr);
		skrollrMedia.init(_skrollr, {}, _m);

		$('#content').show();
		$('#loading').hide();

	});

});