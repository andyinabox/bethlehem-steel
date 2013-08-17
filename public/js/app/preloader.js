define([
	'jquery',
	'lodash',
	'mediator-js',
	'PxLoader',
	'PxLoaderImage',
	'PxLoaderSound',
	'PxLoaderVideo',
	'app/soundmanager',
	'config/media',
], function($, _, mediator, PxLoader, PxLoaderImage, PxLoaderSound, PxLoaderVideo, soundmanager, media) {
	var self = {},
		_defaults = {
		},
		_opts,
		
		_loader,
		_mediator,

		// deferreds
		_initDfd = $.Deferred(),
		_domReadyDfd = $.Deferred(),

		// media
		_mediaRoot = media.mediaRoot,

		//jquery
		_$loading,
		_$content,
		_$videoElements,
		_$audioElements;

	function _init(opts, mediator) {
		_opts = _.defaults(_defaults, (opts||{}));

		_mediator = mediator || new Mediator();

		_loader = new PxLoader({

		});


		_loader.addCompletionListener(_onAllMediaLoaded);
		_loader.addProgressListener(_onLoadProgress);

		_(media.images).each(_registerImage);
		_(media.videos).each(_registerVideo);

		// init soundmanager before loading sounds
		soundmanager.init().then(function(){
			_(media.sounds).each(_registerSound);
			_loader.start();		
		});

		$(_domReady);

		return $.when(_initDfd, _domReadyDfd).promise();
	};

	function _domReady() {
		_domReadyDfd.resolve();
	}

	function _onAllMediaLoaded(e) {
		_mediator.publish('preloader:complete', e);
		_initDfd.resolve(e);
	}

	function _onLoadProgress(e) {
		_mediator.publish('preloader:progress', e)
	};

	/**
	 * Register an image media item
	 * @param  {string} relativePath
	 * @param  {string} key
	 */
	function _registerImage(relativePath, key) {
		var path = _mediaRoot + relativePath,
			$bgImg,
			$img;

		_loader.addImage(path, [key, 'images']);

		$(function(){

			// background image
			$bgImg = $('.image[data-mediaid="'+key+'"]');
			$bgImg.css('background-image', 'url("'+path+'")');

			// regular ol images
			$img = $('img[src="'+relativePath+'"]');
			$img.attr('src', path);
		});
	};

	/**
	 * Register a video media item
	 * @param  {string} relativePath
	 * @param  {string} key
	 */
	function _registerVideo(relativePath, key) {
		var path = _mediaRoot + relativePath,
			$vid;
		if(!/Safari/.test(navigator.userAgent || navigator.vendor || window.opera)) {
			_loader.addVideo(path, [key, 'videos']);
		}

		$(function(){
			$vid = $('video[data-mediaid="'+key+'"]');
			_addSource($vid, path);	
		})
	};

	/**
	 * Register a sound media item
	 * @param  {string} relativePath
	 * @param  {string} key
	 */
	function _registerSound(relativePath, key) {
		var path = _mediaRoot + relativePath,
			$snd;
		console.log(path);
		_loader.addSound(key, path, [key, 'sounds']);

		$(function(){
			$snd = $('audio[data-mediaid="'+key+'"]');
			_addSource($snd, path);			
		})
	};

	/**
	 * Add a source to a media element
	 * @param {object} $el
	 * @param {string} path
	 * @param {string} type
	 */
	function _addSource($el, path, type) {
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

	self.init = _init;

	return self;
});