define([
	'jquery',
	'lodash',
	'skrollr',
	'mediator-js',
	'bowser',
	'app/preloader',
	'app/transitions',
	'app/skrollr-media',
	'app/dev'
], function($, _, skrollr, mediator, bowser, preloader, transitions, skrollrMedia, dev) {
	var self = {},
		_m = new Mediator(),
		_skrollr,
		$loadingMessage = $('#loadingMessage');

	function _init() {

		_devMode();

		if(bowser.webkit) {

			_registerTransitions(transitions);
			_registerEvents(_m);

			$(_onDomReady);

			preloader.init({},_m).then(function(e){


				$('.fullscreen').height($(window).height());

				_skrollr = skrollr.init();
				dev.setSkrollr(_skrollr);

				transitions.init();

				skrollrMedia.init(_skrollr, {}, _m);

				// $('#content').show();
				$('#fastSpinner').hide();
				$('#slowSpinner').show();
				$('#loading').delay(200).fadeOut();

			});	

		} else {
			$(_showBrowserPrompt);
		}

	}

	function _showBrowserPrompt() {

			$('#content').hide();
			$('#browser').show();
			$('#loading').hide();		
	}


	function _onDomReady() {
		$('#loading').fadeIn(300);
		$loadingMessage = $('#loadingMessage');	
	}

	function _registerTransitions(transitions) {

	transitions.registerTransition('videoFeature', function(evt){

		evt.loop(function(scrollTop){
			var $this = $(this);
				$vid = $this.find('video'),
				position = $(this).position(),
				height = $(this).height(),
				vidHeight = $vid.height(),
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

	}


	function _registerEvents(m) {
		_m.subscribe('preloader:images:start', function(e) {
			$('#loadingMessage').find('.loadingImages').fadeIn();
		});


		_m.subscribe('preloader:sounds:start', function(e) {
			$('#loadingMessage').find('.loadingSounds').fadeIn();
		
		});


		_m.subscribe('preloader:videos:start', function(e) {
			$('#loadingMessage').find('.loadingVideos').fadeIn();
		
		});	

		_m.subscribe('preloader:images:progress', function(e) {
			var $div = $('#loadingMessage').find('.loadingImages');
			$div.find('.count').html(e.completed+'/'+e.count);
		});


		_m.subscribe('preloader:sounds:progress', function(e) {
			var $div = $('#loadingMessage').find('.loadingSounds');
			$div.find('.count').html(e.completed+'/'+e.count);	
		});


		_m.subscribe('preloader:videos:progress', function(e) {
			var $div = $('#loadingMessage').find('.loadingVideos');
			$div.find('.count').html(e.completed+'/'+e.count);	
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
	}

	function _devMode() {

		// init dev mode
		dev.init({}, _m);

		_(preloader.getEvents()).each(function(channel, index){
			console.log('registering preloader channel "'+channel+'"');
			_m.subscribe(channel, function(evt, ch) {
				if(evt && evt.key) {
					console.log('loaded '+evt.type+' '+evt.key+' ('+evt.completed+'/'+evt.count+')');
				} else {
					console.log('event channel "'+channel+'" triggered with args ', arguments);
				}
			});
		});

	}


	self.init = _init;

	return self;



});