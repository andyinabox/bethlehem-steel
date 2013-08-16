define(['jquery', 'lodash', 'skrollr'], function($, _, skrollr) {
	var self = {},
		_defaults = {
			// data attributes
			startPlaybackAttr : 'start',
			stopPlaybackAttr : 'stop',
			startFadeAttr : 'startFadeLength',
			stopFadeAttr : 'stopFadeLength'
		},
		_skrollr,
		_opts,

		_$videoElements,
		_$audioElements,

		// stolen from skrollr
		_now = Date.now || function() {
			return +new Date();
		},

		// stolen from skrollr
		_isMobile = ((function() {
			return (/Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i).test(navigator.userAgent || navigator.vendor || window.opera);
		})());

	function _init(skrollrInstance, opts) {
		var requestAnimFrame;

		// set skrollr instance
		if(skrollrInstance) {
			_skrollr = skrollrInstance;
		} else {
			throw new Error('Must provide skrollr instance!')
		}

		// set options
		_opts = _.defaults(_defaults, (opts||{}));


		// dom ready
		$(_domReady);

		// get RAF polyfill if necessary
		requestAnimFrame = _polyfillRAF();


		//Let's go.
		(function animloop(){
			_render();
			requestAnimFrame(animloop);
		}());
	}

	function _domReady() {
		// only include elements that have the 'start' data attribute
		_$videoElements = $('video[data-'+_opts.startPlaybackAttr+']');
		_$audioElements = $('audio[data-'+_opts.startPlaybackAttr+']');
	}

	function _render() {
		var top = _skrollr.getScrollTop();

		console.log(top);
		// videos
		if(_$videoElements && _$videoElements.length > 0) {
			_$videoElements.each(function(index, video){
				var $this = $(this),
					start = $this.data(_opts.startPlaybackAttr),
					stop = $this.data(_opts.stopPlaybackAttr),
					playing = !video.paused;

				if(top >= start && top < stop) {
					if(!playing) {
						video.play();
					}
				} else if(playing) {
					video.pause();
				}
			});
		}

		// audio
		if(_$audioElements && _$audioElements.length > 0) {
			_$audioElements.each(function(index, audio){
				var $this = $(this),
					start = $this.data(_opts.startPlaybackAttr),
					stop = $this.data(_opts.stopPlaybackAttr),
					playing = !audio.paused;

				if(top >= start && top < stop) {
					if(!playing) {
						audio.play();
					}
				} else if(playing) {
					audio.pause();
				}
			});
		}
	};


	/**
	 * Copped this one directly from skrollr
	 * @return {object} requestAnimationFrame object or polyfill
	 */
	function _polyfillRAF() {
		var requestAnimFrame = window.requestAnimationFrame || window[theCSSPrefix.toLowerCase() + 'RequestAnimationFrame'];

		var lastTime = _now();

		if(_isMobile || !requestAnimFrame) {
			requestAnimFrame = function(callback) {
				//How long did it take to render?
				var deltaTime = _now() - lastTime;
				var delay = Math.max(0, 1000 / 60 - deltaTime);

				window.setTimeout(function() {
					lastTime = _now();
					callback();
				}, delay);
			};
		}

		return requestAnimFrame;
	};


	self.init = _init;

	return self;
});
