define([
	'jquery',
	'lodash',
	'pxloader',
	'pxloader-image',
	'pxloader-sound',
	'pxloader-video',
	'config/media',
], function($, _, PxLoader, PxLoaderImage, PsLoaderSound, PxLoaderVideo, media) {
	var self = {},
		_defaults = {},
		_opts,
		
		_loader,

		// deferreds
		_initDfd = $.Deferred(),

		// media
		_mediaRoot = media.mediaRoot,

		//jquery
		_$videoElements,
		_$audioElements;

	function _init(opts) {
		_opts = _.defaults(_defaults, (opts||{}));

		// _loader = new PxLoader({

		// });

		_(media.images).each(_registerImage);
		_(media.videos).each(_registerVideo);
		_(media.sounds).each(_registerSound);

		return _initDfd;
	};

	/**
	 * Register an image media item
	 * @param  {string} relativePath
	 * @param  {string} key
	 */
	function _registerImage(relativePath, key) {
		var path = _mediaRoot + relativePath,
			$img;

		$(function(){
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
			switch(/\.[0-9a-z]+$/i.exec(path)[0]) {
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
					.attr('ty[e', type)
					.appendTo($el);
	};

	self.init = _init;

	return self;
});