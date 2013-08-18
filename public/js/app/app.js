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

	_m.subscribe('skrollrMedia:play', function(id, volume) {
		dev.log(id + ' playing at volume '+volume)
	})

	_m.subscribe('skrollrMedia:pause', function(id, volume) {
		dev.log(id + ' paused at volume '+volume)
	})

	// testing out preloader events
	_(preloader.getEvents()).each(function(channel, index){
		console.log('registering preloader channel "'+channel+'"');
		_m.subscribe(channel, function() {
			console.log('event channel "'+channel+'" triggered with args ', arguments);
		});
	});

	preloader.init({},_m).then(function(e){

		$('.fullscreen').height($(window).height());
		$('#textlayer').css('top',$(window).height());
		_skrollr = skrollr.init();
		dev.setSkrollr(_skrollr);
		skrollrMedia.init(_skrollr, {}, _m);

		$('#content').show();
		$('#loading').hide();
	});

});