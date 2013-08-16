define([
	'jquery',
	'lodash',
	'pxloader',
	'pxloader-image',
	'pxloader-sound',
	'pxloader-video',
	'json!../config/media.json',
], function($, _, PxLoader, PxLoaderImage, PsLoaderSound, PxLoaderVideo, media) {
	var self = {},
		_defaults = {},
		_opts,
		
		_loader,

		// deferreds
		_initDfd = $.Deferred(),

		// media
		_mediaRoot = media.mediaRoot;

	function _init(opts) {
		_opts = _.defaults(_defaults, (opts||{}));

		_loader = new PxLoader({

		});

		return _initDfd;
	};

	return self;
});