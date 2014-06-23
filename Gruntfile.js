module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bowercopy: {
            options: {
                clean: true
            },

            vendor: {
                options: {
                    destPrefix: 'js/vendor'
                },
                files: {
                    jquery: 'jquery/dist/jquery.js',
                    underscore: 'underscore/underscore.js',
                    backbone  : 'backbone/backbone.js',
                    requirejs : 'requirejs/require.js',
                    'requirejs/text.js' : 'requirejs-text/text.js'
                }
            }
        },

        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%= pkg.name %>.js',
                dest: 'build/<%= pkg.name %>.min.js'
            }
        },

        less: {
            prod: {
                options: {

                },

                files: {
                    'css/lib/selectius.css': 'less/selectius.less'
                }
            }
        },

        jsdoc : {
            dist: {
                src: ['js/lib/*.js'],
                options: {
                    destination: 'doc'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
//    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-bowercopy');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task(s).
//    grunt.registerTask('default', ['uglify']);

};