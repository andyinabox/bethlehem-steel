/*global module:false*/
module.exports = function(grunt) {


    grunt.initConfig({

        qunit: {
          all: ['tests/*.html']
        },

        requirejs: {
          std: {
            options: {
              // almond: true,
              // replaceRequireScript: [{
              //   files: ['build/index.html'],
              //   module: 'main'
              // }],
              appDir: 'public',
              baseUrl: 'js',
              dir: 'build',
              mainConfigFile: 'public/js/config.js',
              // only optimize the files included via require
              skipDirOptimize: true,
              modules: [
                {
                  name: 'main',
                  exclude: ['config'],
                  include: ['app/app']
                }
              ],
              optimizeCss: "standard",
              removeCombined: true,
              fileExclusionRegExp: /^(\.)/,
              wrap: true
            }
          }
        },

        jshint: {
          options: {
            curly: true,
            eqeqeq: true,
            immed: true,
            latedef: true,
            newcap: true,
            noarg: true,
            sub: true,
            undef: true,
            eqnull: true,
            browser: true,
            nomen: true,
            globals: {
              define: true,
              jQuery: true
            }
          },
          files: ['principium/*.js', 'principium.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-requirejs');

    grunt.registerTask('default', ['jshint', 'qunit']);
    grunt.registerTask('build', 'requirejs');
};