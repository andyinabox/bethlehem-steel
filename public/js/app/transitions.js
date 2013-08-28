define([
	'jquery',
	'lodash',
	'skrollr',
	'app/requestAnimationFrame'
], function($, _, skrollr, rAF) {

	var self = {},
		_defaults = {
			transitionsAttr: 'transitions'
		},
		_opts,

		_initDfd = $.Deferred(),

		_transitions = {},
		_skrollr,

		_loopCallbacks = [];

	/**
	 * Initialize the transitions module
	 * @param  {Object} opts Configuration options
	 * @return {Object} Deferred object that resolves when initialization is complete.
	 */
	function _init(opts) {
		_opts = _.defaults(_defaults, (opts||{}));

		_skrollr = skrollr.get();

		$(_onDomReady);

		return _initDfd.promise();
	};

	/**
	 * Dom ready event
	 */
	function _onDomReady() {
		_setDocumentTransitions();

		// GO!!
		_loop();
		
		_initDfd.resolve();
	};

	function _loop(timestamp) {
		var scrollTop = _skrollr.getScrollTop(),
			i = 0;

		for(i; i<_loopCallbacks.length; i++) {
			_loopCallbacks[i].cb.apply(_loopCallbacks[i].ctx, [scrollTop]);
		}

		requestAnimationFrame(_loop);
	};

	/**
	 * Register a transition
	 * @param  {string}   name     The name of the transition
	 * @param  {Function} callback Callback function for the transition
	 */
	function _registerTransition(name, callback) {
		if(_.isFunction(callback)) {
			_transitions[name] = callback;
		} else {
			throw new Error('Registering transition must include a callback');
		}
	};

	/**
	 * Scan the docoment for transitions and apply.
	 */
	function _setDocumentTransitions() {
		var $t = $('[data-'+_opts.transitionsAttr+']');

		console.log('transition elements', $t);

		$t.each(function(index, element) {
			var transitions = $(this).data(_opts.transitionsAttr),
				event = { 
					skrollr: _skrollr,
					loop: _addAnimationLoopCallback
				};


			if(_.isObject(transitions)) {
				_(transitions).each(function(args, key) {
					args.unshift(event);
					if(_.has(_transitions, key) && _.isArray(args)) {
						_transitions[key].apply(element, args);
					}
				});
			}

		});
	};

	function _addAnimationLoopCallback(callback, context) {
		var ctx = context || arguments.callee.caller;
		if(_.isFunction(callback)) {
			_loopCallbacks.push({cb:callback,ctx:context});
		} else {
			throw new Error('Callback must be a function!');
		}
	};

	self.init = _init;
	self.registerTransition = _registerTransition;

	return self;

});