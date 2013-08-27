define(['jquery', 'lodash', 'skrollr'], function($, _, skrollr) {

	var self = {},
		_defaults = {
			transitionsAttr: 'transitions'
		},
		_opts,

		_initDfd,

		_transitions,
		_skrollr;

	/**
	 * Initialize the transitions module
	 * @param  {Object} opts Configuration options
	 * @return {Object} Deferred object that resolves when initialization is complete.
	 */
	function _init(opts) {
		var _opts = _.defaults(_defaults, (opts||{}));

		_skrollr = skrollr.get();

		$(_onDomReady);


		return _initDfd.promise();
	};

	/**
	 * Dom ready event
	 */
	function _onDomReady() {
		_setDocumentTransitions();
		_initDfd.resolve();
	};

	/**
	 * Register a transition
	 * @param  {string}   name     The name of the transition
	 * @param  {Function} callback Callback function for the transition
	 */
	function _registerTransition(name, callback) {
		if(_.isFunction(callback)) {
			_transition[name] = callback;
		} else {
			throw new Error('Registering transition must include a callback');
		}
	};

	/**
	 * Scan the docoment for transitions and apply.
	 */
	function _setDocumentTransitions() {
		var $t = $('[data-'+_opts.transitionsAttr+']');

		$t.each(function(index, element) {
			var transitions = $(this).data(_opts.transitionsAttr);

			if(_.isObject(transitions)) {
				_(transitions).each(function(args, key) {
					if(_.has(_transitions, key) && _.isArray(args)) {
						_transitions[key].apply(element, args);
					}
				});
			}

		});
	};

	self.init = _init;
	self.registerTransition = _registerTransition;

});