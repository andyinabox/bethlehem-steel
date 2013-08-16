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

        'pxloader': 'lib/pxloader/PxLoader',
        'pxloader-image' : 'lib/pxloader/PxLoaderImage',
        'pxloader-sound' : 'lib/pxloader/PxLoaderSound',
        'pxloader-video' : 'lib/pxloader/PxLoaderVideo',

        'skrollr': 'lib/skrollr/src/skrollr'
    },
    shim: {
    	'skrollr' : {
    		exports: 'skrollr'
    	}
    }
});
