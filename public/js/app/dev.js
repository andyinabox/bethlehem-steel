define(['jquery','lodash','mediator-js'], function($, _, mediator) {

	var self = {},
		_defaults = {
			initMessage : 'Dev mode enabled',
			queryVar : 'dev'
		},
		_opts,
		_mediator,
		_skrollr,
		_enabled,

		_$devbar;

	function _init(opts, mediator) {
		_opts = _.defaults(_defaults, (opts||{}));
		_mediator = mediator || new Mediator();
		_enabled = _checkEnabled();

		if(_enabled) {
			window.DEV = self;
			_showDevDisplay();
			_mediator.subscribe('preloader:progress', _onPreloaderProgress);
			_mediator.subscribe('preloader:complete', _onPreloaderComplete);

		}
	};

	function _onPreloaderProgress(e) {
		_showMessage(e.resource.getName()+' loaded ('+e.completedCount+'/'+e.totalCount+')');
	}

	function _onPreloaderComplete(e) {
		window.setTimeout(_showMessage, 100, 'All media loaded');
	}

	function _setSkrollr(skrollr) {
		if(_enabled) {
			_skrollr = skrollr;

			(function animloop(){
				_$devbar.find('.position').html(_skrollr.getScrollTop());
				window.requestAnimationFrame(animloop);
			}());
		}
	}

	function _showMessage(message) {
		if(_enabled && _.isString(message)) {
			_$devbar.find('.message').html(message);
		}
	}

	function _showDevDisplay() {
		console.log("------- DEV MODE -------");
		$('body').append('<div id="devbar"><span class="position">#</span><span class="message"></span></div>')
		_$devbar = $('#devbar');
		_showMessage(_opts.initMessage);
	};

	function _checkEnabled() {
		var enabled = false,
			query = window.location.search.substring(1),
	    	vars = query.split('&');

	    _(vars).each(function(pair, index, list) {
	    	var split = pair.split('=');
	    	if(decodeURIComponent(split[0]) === _opts.queryVar && !!decodeURIComponent(split[1])) {
	    		enabled = true;
	    	}
	    });

	    return enabled;
	};

	self.init = _init;
	self.setSkrollr = _setSkrollr;
	self.showMessage = _showMessage;
	return self;
});