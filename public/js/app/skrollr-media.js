define(['jquery', 'lodash', 'skrollr', 'mediator-js'], function($, _, skrollr, mediator) {
	var self = {},
		_defaults = {
			// data attributes
			startPlaybackAttr : 'start',
			stopPlaybackAttr : 'stop',
			startFadeAttr : 'startfadelength',
			stopFadeAttr : 'stopfadelength',
			maxVolumeAttr : 'maxvolume',
			minVolumeAttr : 'minvolume',
			fadeLength : 300,
			maxVolume: 1,
			minVolume: 0,
			mute: false
		},
		_mediator,
		_skrollr,
		_opts,
		_mute,

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

	function _init(skrollrInstance, opts, mediator) {
		var requestAnimFrame;

		// set skrollr instance
		if(skrollrInstance) {
			_skrollr = skrollrInstance;
		} else {
			throw new Error('Must provide skrollr instance!')
		}

		_mediator = mediator || new Mediator();

		// set options
		_opts = _.defaults(_defaults, (opts||{}));
		_mute = _opts.mute;

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

		// videos
		if(_$videoElements && _$videoElements.length > 0) {
			_$videoElements.each(function(index, el){
				_handleMediaPlayback(top, el, 'video')
			});
		}

		// audio
		if(_$audioElements && _$audioElements.length > 0) {
			_$audioElements.each(function(index, el){
				_handleMediaPlayback(top, el, 'audio');
			});
		}
	};

	/**
	 * Handle playback events for video or audio
	 * @param  {number} top
	 * @param  {object} el
	 * @param  {string} type
	 */
	function _handleMediaPlayback(top, el, type) {
				var $el = $(el),
					id = $el.data('mediaid') 
					start = $el.data(_opts.startPlaybackAttr),
					stop = $el.data(_opts.stopPlaybackAttr),
					startFadeLength = $el.data(_opts.startFadeAttr),
					stopFadeLength = $el.data(_opts.stopFadeAttr),
					maxVolume = $el.data(_opts.maxVolumeAttr),
					minVolume = $el.data(_opts.minVolumeAttr),
					playing = !el.paused,
					volume = 1;

				// use defaults if not defined w/ data attributes
				startFadeLength = _.isFinite(startFadeLength) ? startFadeLength : _opts.fadeLength;
				stopFadeLength = _.isFinite(stopFadeLength) ? stopFadeLength : _opts.fadeLength;
				maxVolume = _.isFinite(maxVolume) ? maxVolume : _opts.maxVolume;
				minVolume = _.isFinite(minVolume) ? minVolume : _opts.minVolume;

				if(top >= start && top < stop) {

					if (_mute) {
						volume = 0;
					} else if(top < start+startFadeLength) {
						volume = (((top-start) / startFadeLength)*(maxVolume-minVolume))+minVolume;
					} else if (top > stop-stopFadeLength) {
						volume = (((stop-top) / stopFadeLength)*(maxVolume-minVolume))+minVolume;
					}

					el.volume = parseFloat(volume.toFixed(1));

					if(!playing) {
						_mediator.publish('skrollrMedia:play', id, volume);
						el.play();
					}
				} else if(playing) {
					_mediator.publish('skrollrMedia:pause', id, volume);
					el.pause();
				}
	}

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
	self.mute = function(bool) {
		if(_.isBoolean(bool)) {
			_mute = bool;
		} else {
			_mute = !_mute;
		}
		return _mute;
	}

	return self;
});
