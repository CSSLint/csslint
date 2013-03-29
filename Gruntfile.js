/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> Nicole Sullivan and Nicholas C. Zakas;\n' +
            '* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> <%= _.pluck(pkg.licenses, "url").join(", ") %> */\n',
        // Task configuration.
        concat: {
            core: {
                options: {
                    banner: '<%= banner %>\nvar CSSLint = (function(){',
                    footer: '\nreturn CSSLint;\n})();'
                },
                src: [
                    'src/core/CSSLint.js',
                    'src/core/*.js',
                    'src/rules/*.js',
                    'src/formatters/*.js'
                ],
                dest: 'build/<%= pkg.name %>.js'
            },//Build environment workers
            rhino: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/cli/{common, rhino}.js'
                ],
                dest: 'build/<%= pkg.name %>-rhino.js'
            },
            node: {
                options: {
                    banner: '<%= banner %>',
                    footer: '\nexports.CSSLint = CSSLint;'
                },
                src: [
                    'src/core/CSSLint.js',
                    'src/core/*.js',
                    'src/rules/*.js',
                    'src/formatters/*.js'
                ],
                dest: 'build/<%= pkg.name %>-node.js'
            },
            node_cli: {
                options: {
                    banner: '#!/usr/bin/env node\n<%= banner %>'
                },
                src: [
                    'src/cli/{common, node}.js'
                ],
                dest: 'build/npm/cli.js'
            },
            worker: {
                options: {
                    banner: '<%= banner %>'
                },
                src: [
                    'src/core/CSSLint.js',
                    'src/core/*.js',
                    'src/rules/*.js',
                    'src/formatters/*.js',
                    'src/worker/*.js'
                ],
                dest: 'build/<%= pkg.name %>-worker.js'
            },
            whs: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/cli/{common, whs}.js'
                ],
                dest: 'build/<%= pkg.name %>-whs.js'
            },//Build tests
            tests: {
                src: [
                    '!tests/all-rules.js',
                    'tests/**/*.js'
                ],
                dest: 'build/npm/cli.js'
            },
            tests_node: {
                src: [
                    '<%= concat.core.dest %>',
                    'tests/**/*.js'
                ],
                dest: 'build/npm/cli.js'
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            options: {
                curly: true,
                //eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                //unused: true,
                boss: true,
                eqnull: true,
                // Copied from build.xml
                forin: true,
                noempty: true,
                rhino: false,
                // Temporary to suppress warnings that exist when using the latest JSHint
                eqeqeq: false,
                unused: false,
                globals: {
                    jQuery: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            all: {
                src: ['src/**/*.js']
            },
            tests: {
                src: ['test/**/*.js']
            }
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint']
            },
            src: {
                files: '<%= jshint.all.src %>',
                tasks: ['jshint:all']
            },
            lib_test: {
                files: '<%= jshint.tests.src %>',
                tasks: ['jshint:tests']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

};
