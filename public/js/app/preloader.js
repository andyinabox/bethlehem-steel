define([
	'jquery',
	'lodash',
	'mediator-js',
	'config/media',
], function($, _, mediator, media) {
	var self = {},
		_defaults = {
		},
		_opts,
		
		_loader,
		_mediator,

		// deferreds
		_domReadyDfd = $.Deferred(),
		_imagesDfd,
		_videosDfd,
		_soundsDfd,
		_allCompleteDfd,

		// media
		_mediaRoot = media.mediaRoot,

		// this tracks all the preloader objects
		_loader = {
			images: {},
			videos: {},
			sounds: {}
		},

		_events = {
			start: 'preloader:start',
			progress: 'preloader:progress',
			complete: 'preloader:complete',
			//images
			imagesProgress: 'preloader:images:progress',
			imagesComplete: 'preloader:images:complete',
			//videos
			videosProgress: 'preloader:videos:progress',
			videosComplete: 'preloader:videos:complete',
			//sounds
			soundsProgress: 'preloader:sounds:progress',
			soundsComplete: 'preloader:sounds:complete'
		};

	function _init(opts, mediator) {
		_opts = _.defaults(_defaults, (opts||{}));
		_mediator = mediator || new Mediator();

		// set up preloading
		_(media.images).each(_preloadImage);
		_(media.videos).each(_preloadVideo);
		_(media.sounds).each(_preloadSound);

		// set up deferred objects
		_imagesDfd = $.when.apply($, _.pluck(_loader.images, 'promise'));
		_videosDfd = $.when.apply($, _.pluck(_loader.videos, 'promise'));
		_soundsDfd = $.when.apply($, _.pluck(_loader.sounds, 'promise'));
		_allCompleteDfd = $.when(
			_imagesDfd,
			_videosDfd,
			_soundsDfd,
			_domReadyDfd
		);

		// dom ready
		$(_domReady);

		// set up event methods
		_allCompleteDfd.then(_onAllComplete);
		_imagesDfd.then(_onImagesComplete);
		_imagesDfd.then(_onVideosComplete);
		_imagesDfd.then(_onVideosComplete);


		// fire start event
		_mediator.publish(_events.start);

		return _allCompleteDfd.promise();
	};

	function _domReady() {

		_(_loader.images).each(_applyImage);
		_(_loader.videos).each(_applyVideo);
		_(_loader.sounds).each(_applySound);

		_domReadyDfd.resolve();
	}

	/*
	 * PRELOAD METHODS 
	 */


	function _preloadImage(relativePath, key) {
		var dfd = $.Deferred(),
			img = new Image(),
			path = _getPath(_mediaRoot, relativePath);

		// set up preloading
		$(img).load(dfd.resolve);
		img.src = path;
		_loader.images[key] = _formatPreloaderObject(path, dfd);

		dfd.then(_onImagesProgress);
		dfd.then(_onAllProgress);

		return dfd.promise();
	}

	function _preloadVideo(relativePath, key) {
		var dfd = $.Deferred(),
			$vid = $('video'),
			path = _getPath(_mediaRoot, relativePath);

		// set up preloading
		$vid.on('canplaythrough', dfd.resolve);
		$vid.attr('src', path);
		$vid.get(0).load();
		_loader.videos[key] = _formatPreloaderObject(path, dfd);

		// event callbacks
		dfd.then(_onVideosProgress);
		dfd.then(_onAllProgress);

		return dfd.promise();
	}

	function _preloadSound(relativePath, key) {
		var dfd = $.Deferred(),
			$snd = $('audio'),
			path = _getPath(_mediaRoot, relativePath);

		// set up preloading
		$snd.on('canplaythrough', dfd.resolve);
		$snd.attr('src', path);
		$snd.get(0).load();
		_loader.videos[key] = _formatPreloaderObject(path, dfd);

		// event callbacks
		dfd.then(_onSoundsProgress);
		dfd.then(_onAllProgress);

		return dfd.promise();
	}

	/*
	 * APPLY METHODS 
	 */

	function _applyImage(preloader, key) {
		var path = preloader.path,
			bgSel = '.image[data-mediaid="'+key+'"]',
			imgSel= 'img[data-mediaid="'+key+'"]',
			$bgImg = $(bgSel),
			$img = $(imgSel);			

			// background images
			$bgImg.css('background-image', 'url("'+path+'")');

			// regular ol images
			$img.attr('src', path);
	}

	function _applyVideo(preloader, key) {
		var path = preloader.path,
			vidSel = 'video[data-mediaid="'+key+'"]',
			$vid = $(vidSel);

		_addMediaSourceElement($vid, path);		
	}

	function _applySound(preloader, key) {
		var path = preloader.path,
			sndSel = 'audio[data-mediaid="'+key+'"]',
			$snd = $(sndSel);

		_addMediaSourceElement($snd, path);		
	}

	/*
	 * UTILITY FUNCTIONS 
	 */

	/**
	 * Add a source to a media element
	 * @param {object} $el
	 * @param {string} path
	 * @param {string} type
	 */
	function _addMediaSourceElement($el, path, type) {
		var type;

		// auto-detect the path from media type
		if(_.isUndefined(type)) {
			switch(/\.([0-9a-z]+)$/i.exec(path)[1]) {
				case 'mp4':
					type = 'video/mp4'
					break;
				case 'mp3':
					type = 'audio/mpeg'
					break;
			}
		}

		return $('<source>')
					.attr('src', path)
					.attr('type', type)
					.appendTo($el);
	};

	function _formatPreloaderObject(path, dfd) {
		return {
			path: path,
			promise: dfd.promise()
		}
	}

	function _getPath(root, relativePath) {
		return root + relativePath;
	}

	/*
	 * EVENTS
	 */

	// complete events
	function _onAllComplete() {
		_mediator.publish(_events.complete, arguments);
	}
	function _onImagesComplete() {
		_mediator.publish(_events.imagesComplete, arguments);
	}
	function _onVideosComplete() {
		_mediator.publish(_events.videosComplete, arguments);		
	}
	function _onSoundsComplete() {
		_mediator.publish(_events.soundsComplete, arguments);				
	}

	//progress events
	function _onAllProgress() {
		_mediator.publish(_events.progress, arguments);		
	}
	function _onImagesProgress() {
		_mediator.publish(_events.imagesProgress, arguments);				
	}
	function _onVideosProgress() {
		_mediator.publish(_events.videosProgress, arguments);				
	}
	function _onSoundsProgress() {
		_mediator.publish(_events.soundsProgress, arguments);				
	}

	self.init = _init;

	/**
	 * Returns an array of all of the events.
	 */
	self.getEvents = function() { return _.map(_events, function(v,k){ return v; }); }

	return self;
});