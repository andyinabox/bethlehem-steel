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

        /* libraries */
        jquery: 'http://code.jquery.com/jquery-1.9.0.min',
        lodash: 'http://cdnjs.cloudflare.com/ajax/libs/lodash.js/1.0.0-rc.3/lodash.min',

        /* project */
        // _app: 'app/_app'
        flickr: 'app/flickr',
        is: 'app/is',
        screenSize: 'app/screen-size',
        home: 'app/pages/home'
    },
    shim: {
        /* define dom query library */
        'jquery': {
            exports: '$'
        },
        /* define js utility library */
        'lodash': {
            exports: '_'
        },

        'swipe': {
            exports: 'Swipe'
        },

        'hammer': {
            exports: 'Hammer'
        }
        /* export app facade */
        // '_app': { exports: '_app'}
    }
});
