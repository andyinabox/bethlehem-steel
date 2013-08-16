require.config({
    baseUrl: 'js/',
    urlArgs: "_=" + (new Date()).getTime(),
    paths: {
        /* dirs */
        // if you want to alias directories, i.e. `"a" : "some/path"`

        /* require plugins */
        async: 'lib/requirejs-plugins/src/async',
        depend: 'lib/requirejs-plugins/src/depend',
        font: 'lib/requirejs-plugins/src/font',
        goog: 'lib/requirejs-plugins/src/goog',
        image: 'lib/requirejs-plugins/src/image',
        json: 'lib/requirejs-plugins/src/json',
        noext: 'lib/requirejs-plugins/src/noext',
        mdown: 'lib/requirejs-plugins/src/mdown',
        propertyParser: 'lib/requirejs-plugins/src/propertyParser',
        text: 'lib/requirejs-plugins/lib/text',

        /* libraries */
        jquery: 'lib/jquery/jquery',
        lodash: 'lib/lodash/lodash',

        'PxLoader': 'lib/pxloader/PxLoader',
        'PxLoaderImage' : 'lib/pxloader/PxLoaderImage',
        'PxLoaderSound' : 'lib/pxloader/PxLoaderSound',
        'PxLoaderVideo' : 'lib/pxloader/PxLoaderVideo',

        'soundmanager2' : 'lib/soundmanager2/script/soundmanager2',

        'skrollr': 'lib/skrollr/src/skrollr'
    },
    shim: {
    	'skrollr' : {
    		exports: 'skrollr'
    	},
    	'soundmanager2': {
    		exports: 'soundManager'
    	},
    	'PxLoaderSound': ['soundmanager2']
    }
});
