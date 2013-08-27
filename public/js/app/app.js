define([
	'jquery',
	'lodash',
	'skrollr',
	'mediator-js', 
	'app/preloader',
	'app/transitions',
	'app/skrollr-media',
	'app/dev'
], function($, _, skrollr, mediator, preloader, transitions, skrollrMedia, dev) {
	var _m = new Mediator(),
		_skrollr;

	dev.init({}, _m);


	transitions.registerTransition('videoFeature', function(evt){
		var $this = $(this);
			$vid = $this.find('video'),
			position = $(this).position(),
			height = $(this).height();

		console.log('apply transition', this, $(this));

		evt.loop(function(scrollTop){
			var vidHeight = $vid.height(),
				wHeight = $(window).height();


			if(scrollTop > position.top-(wHeight/2-vidHeight/2)
				&& scrollTop < position.top+height-(wHeight/2+vidHeight/2)) {
				$vid.css('top', (scrollTop-position.top)+(wHeight/2)-(vidHeight/2));
			} else if(scrollTop > position.top+height-(wHeight/2+vidHeight/2)){
				$vid.css('top', height-vidHeight);
			} else {
				$vid.css('top', 0);				
			}

		}, this);
	});

	_m.subscribe('preloader:progress', function(e) {
	
	});

	_m.subscribe('skrollrMedia:play', function(id, volume) {
		dev.log(id + ' playing at volume '+volume)
	})

	_m.subscribe('skrollrMedia:pause', function(id, volume) {
		dev.log(id + ' paused at volume '+volume)
	})

	_m.subscribe('preloader:progress', function(evt) {
		dev.log('Loading '+evt.type+' "'+evt.path+'" ('+evt.completed+'/'+evt.count+':'+evt.total.completed+'/'+evt.total.count+')');
	})

	_m.subscribe('preloader:complete', function(evt) {
		dev.log('All media loaded');
	})

	// testing out preloader events
	// _(preloader.getEvents()).each(function(channel, index){
	// 	console.log('registering preloader channel "'+channel+'"');
	// 	_m.subscribe(channel, function(evt, ch) {
	// 		if(evt && evt.key) {
	// 			console.log('loaded '+evt.type+' '+evt.key+' ('+evt.completed+'/'+evt.count+')');
	// 		} else {
	// 			console.log('event channel "'+channel+'" triggered with args ', arguments);
	// 		}
	// 	});
	// });

	preloader.init({},_m).then(function(e){

		$('.fullscreen').height($(window).height());
		// $('#textlayer').css('top',$(window).height());
		_skrollr = skrollr.init();
		dev.setSkrollr(_skrollr);

		transitions.init();

		skrollrMedia.init(_skrollr, {}, _m);

		// $('#content').show();
		$('#loading').hide();
	});

});