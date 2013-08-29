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

		_imagesLoaded = 0,
		_videosLoaded = 0,
		_soundsLoaded = 0,
		_totalLoaded = 0,

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
		_(media.images).each(_registerImage);
		_(media.videos).each(_registerVideo);
		_(media.sounds).each(_registerSound);

		// set up deferred objects
		_imagesDfd = $.when.apply($, _.pluck(_loader.images, 'dfd'));
		_videosDfd = $.when.apply($, _.pluck(_loader.videos, 'dfd'));
		_soundsDfd = $.when.apply($, _.pluck(_loader.sounds, 'dfd'));

		_allCompleteDfd = $.when(
			_imagesDfd,
			// _videosDfd,
			_soundsDfd,
			_domReadyDfd
		);

		// set up event methods
		_imagesDfd.then(_onImagesComplete);
		_videosDfd.then(_onVideosComplete);
		_soundsDfd.then(_onSoundsComplete);

		// load sounds after images
		$.when(_domReadyDfd, _imagesDfd).then(function(){
			_(_loader.sounds).each(_applySound);
			_(_loader.videos).each(_applyVideo);
		});

		// $.when(_domReadyDfd, _soundsDfd).then(function(){
		// 	_(_loader.videos).each(_applyVideo);
		// });

		_allCompleteDfd.then(_onAllComplete);

		// dom ready
		$(_domReady);

		// fire start event
		_mediator.publish(_events.start);

		return _allCompleteDfd.promise();
	};

	function _domReady() {

		_(_loader.images).each(_applyImage);

		_domReadyDfd.resolve();
	}


	/*
	 * REGISTRATION METHODS 
	 */


	function _registerImage(relativePath, key) {
		var dfd = $.Deferred(),
			$img = $('<img>'),
			path = _getPath(_mediaRoot, relativePath);

		// set up preloading
		$img.load(dfd.resolve);
		$img.attr('src', path);
		_loader.images[key] = _formatPreloaderObject(path, dfd);

		dfd.done(
			function(){
				_imagesLoaded++;
				_totalLoaded++;
				_onImagesProgress(key, path,  _imagesLoaded, _.size(_loader.images));
			}
		);

		return dfd.promise();
	}

	function _registerVideo(relativePath, key) {
		var dfd = $.Deferred(),
			path = _getPath(_mediaRoot, relativePath);

		_loader.videos[key] = _formatPreloaderObject(path, dfd);

		// event callbacks
		dfd.done(
			function(){
				_videosLoaded++;
				_totalLoaded++;
				_onVideosProgress(key, path, _videosLoaded, _.size(_loader.videos));
			}
		);

		return dfd.promise();
	}

	function _registerSound(relativePath, key) {
		var dfd = $.Deferred(),
			path = _getPath(_mediaRoot, relativePath);

		_loader.sounds[key] = _formatPreloaderObject(path, dfd);

		// event callbacks
		dfd.done(
			function(){
				_soundsLoaded++;
				_totalLoaded++;
				_onSoundsProgress(key, path, _soundsLoaded, _.size(_loader.sounds));
			}
		);

		return dfd.promise();
	}

	/*
	 * APPLY METHODS 
	 */

	function _applyImage(preloader, key) {
		var path = preloader.path,
			bgSel = '.image[data-mediaid="'+key+'"]',
			imgSel= 'img[data-mediaid="'+key+'"],img[src="'+media.images[key]+'"]',
			$bgImg = $(bgSel),
			$img = $(imgSel);			

			// background images
			$bgImg.css('background-image', 'url("'+path+'")');


			// console.log('image', $img);
			// regular ol images
			$img.attr('src', path);
	}

	function _applyVideo(preloader, key) {
		var path = preloader.path,
			vidSel = 'video[data-mediaid="'+key+'"]',
			$vid = $(vidSel),
			loaded;

		// force preload with fake vid
		if($vid.length < 1) vid = $('<video>');

		$vid.on('canplaythrough', preloader.dfd.resolve);
		$vid.on('load', preloader.dfd.resolve);

		// for future reference, may need to use some tricks
		// to get working on the iPad:
		// https://gist.github.com/millermedeiros/891886
		$vid.each(function(i,vid){
			vid.src = path;
			vid.load();
		});

		// _addMediaSourceElement($vid, path);		
	}


	function _applySound(preloader, key) {
		var path = preloader.path,
			sndSel = 'audio[data-mediaid="'+key+'"]',
			$snd = $(sndSel);

		if($snd.length < 1) $snd = $('<audio>');

		$snd.on('canplaythrough', preloader.dfd.resolve);
		$snd.on('load', preloader.dfd.resolve);

		$snd.each(function(i, snd){
			snd.src = path;
			snd.load();
		});

		// _addMediaSourceElement($snd, path);		
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
		var type,
			$source;

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

		$source = $('<source>')
					.attr('src', path)
					.attr('type', type)
					.appendTo($el);

		return $source;
	};

	function _formatPreloaderObject(path, dfd) {
		return {
			path: path,
			dfd: dfd
		}
	}


	function _getPath(root, relativePath) {
		return root + relativePath;
	}

	function _formatProgressEventObject(key, path, completed, count, type) {
		return {
			key: key,
			path: path,
			completed: completed,
			count: count,
			type: type,
			timestamp: (new Date()).getTime(),
			total: {
				completed: _getTotalLoadedCount(),
				count: _getTotalMediaCount()
			}
		}
	}

	function _formatCompletedEventObject(types) {
		var eventObj = {};

		_(types).each(function(type){
			if(_.has(_loader, type)) {
				eventObj[type] = _.map(_loader[type], function(value, key, list){
					return {
						key: key,
						path: value.path,
						status: value.dfd.state()
					}
				});
			}
		});

		eventObj.timestamp = (new Date()).getTime()

		return eventObj;

 	}


	function _getTotalMediaCount() {
		var total = 0;
		total += _.size(_loader.images);
		total += _.size(_loader.videos);
		total += _.size(_loader.sounds);
		return total;
	}

	function _getTotalLoadedCount() {
		return _totalLoaded;
	}

	/*
	 * EVENTS
	 */

	// complete events
	function _onAllComplete() {
		_mediator.publish(_events.complete, _formatCompletedEventObject(['images', 'videos', 'sounds']));
	}
	function _onImagesComplete() {
		_mediator.publish(_events.imagesComplete, _formatCompletedEventObject(['images']));
	}
	function _onVideosComplete() {
		_mediator.publish(_events.videosComplete, _formatCompletedEventObject(['videos']));		
	}
	function _onSoundsComplete() {
		_mediator.publish(_events.soundsComplete, _formatCompletedEventObject(['sounds']));				
	}




	function _onImagesProgress(key, path, completed, count) {
		var evt = _formatProgressEventObject(key, path, completed, count, 'image');
		_mediator.publish(_events.imagesProgress, evt);
		_mediator.publish(_events.progress, evt);			
	}

	function _onVideosProgress(key, path, completed, count) {
		var evt = _formatProgressEventObject(key, path, completed, count, 'video');
		_mediator.publish(_events.videosProgress, evt);
		_mediator.publish(_events.progress, evt);		
	}

	function _onSoundsProgress(key, path, completed, count) {
		var evt = _formatProgressEventObject(key, path, completed, count, 'sound');
		_mediator.publish(_events.soundsProgress, evt);
		_mediator.publish(_events.progress, evt);
	}


	self.init = _init;

	/**
	 * Returns an array of all of the events.
	 */
	self.getEvents = function() { return _.map(_events, function(v,k){ return v; }); }

	return self;
});