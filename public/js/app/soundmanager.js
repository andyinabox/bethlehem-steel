define(['jquery', 'lodash', 'soundmanager2'], function($, _, soundManager){

	var self = {},
		_defaults = {
			soundManagerDir: 'js/lib/soundManager2/swf/',
		}, 
		_opts,
		_initDfd = $.Deferred();

	function _init(opts) {
		_opts = _.defaults(_defaults, (opts||{}));

		soundManager.setup({
			url: _opts.soundManagerDir,
			preferFlash: false,
			debugMode: false,
			onready: _onSoundManagerReady,
			ontimeout: _onSoundManagerTimeout
		});

		// initialize the sound manager 
		// soundManager.url = _opts.soundManagerDir; 
		// soundManager.flashVersion = 9; 
		// soundManager.useHighPerformance = true; // reduces delays 
	 
		// // reduce the default 1 sec delay to 500 ms 
		// soundManager.flashLoadTimeout = 500; 
	 
		// // mp3 is required by default, but we don't want any requirements 
		// soundManager.audioFormats.mp3.required = false; 
	 
		// soundManager.ontimeout(_onSoundManagerTimeout); 
		// soundManager.onready(_onSoundManagerReady); 

		return _initDfd.promise();
	};
 
	function _onSoundManagerReady() {
		_initDfd.resolve();
	};

	function _onSoundManagerTimeout() {
		// no flash, go with HTML5 audio 
		soundManager.useHTML5Audio = true; 
		soundManager.preferFlash = false; 
		soundManager.reboot(); 		
	};

	self.soundManager = soundManager;
	self.init = _init;

	return self;
})