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
        //Parser lib copy for verions that can't user requirejs
        parserlib: 'node_modules/parserlib/lib/node-parserlib.js',
        //Core CSSLint files used by most versions
        csslint_files: [
            'src/core/CSSLint.js',
            'src/core/*.js',
            'src/rules/*.js',
            'src/formatters/*.js'
        ],
        //Core fileset used by most versions
        core_files: [
            '<%= parserlib %>',
            '<%= csslint_files %>'
        ],
        // Task configuration.
        clean: {
            build: ['build'],
            release: ['release']
        },
        changelog: {
            dest: 'CHANGELOG'
        },
        concat: {
            core: {
                options: {
                    banner: '<%= banner %>\n' +
                            //Hack for using the node version of parserlib
                            'var exports = exports || {};\n' +
                            'var CSSLint = (function(){\n',
                    footer: '\nreturn CSSLint;\n})();'
                },
                src: [
                    '<%= core_files %>'
                ],
                dest: 'build/<%= pkg.name %>.js'
            },//Build environment workers
            rhino: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/cli/common.js',
                    'src/cli/rhino.js'
                ],
                dest: 'build/<%= pkg.name %>-rhino.js'
            },
            node: {
                options: {
                    banner: '<%= banner %>\n' +
                            'var parserlib = require("parserlib");\n',
                    footer: '\nexports.CSSLint = CSSLint;'
                },
                files: {
                    'build/<%= pkg.name %>-node.js': ['<%= csslint_files %>'],
                    'build/npm/lib/<%= pkg.name %>-node.js': ['<%= csslint_files %>']
                }
            },
            node_cli: {
                options: {
                    banner: '#!/usr/bin/env node\n<%= banner %>'
                },
                src: [
                    'src/cli/common.js',
                    'src/cli/node.js'
                ],
                dest: 'build/npm/cli.js'
            },
            tests: {
                src: [
                    'tests/**/*.js',
                    '!tests/all-rules.js'
                ],
                dest: 'build/<%= pkg.name %>-tests.js'
            },
            worker: {
                options: {
                    banner: '<%= banner %>\n' +
                            //Hack for using the node version of parserlib
                            'var exports = exports || {};\n'
                },
                src: [
                    '<%= core_files %>',
                    'src/worker/*.js'
                ],
                dest: 'build/<%= pkg.name %>-worker.js'
            },
            wsh: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/cli/common.js',
                    'src/cli/wsh.js'
                ],
                dest: 'build/<%= pkg.name %>-wsh.js'
            }
        },
        copy: {
            release: {
                files: {
                    'build': 'release',
                    'release/npm/package.json': 'package.json'
                }
            }
        },
        includereplace: {
            release: {
                options: {
                    // Global variables available in all files
                    globals: {
                        VERSION: '<%= pkg.version %>'
                    },
                    prefix: '@',
                    suffix: '@'
                },
                // Files to perform replacements and includes with
                src: 'build/**/*.*',
                // Destinaion directory to copy files to
                dest: 'release/'
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
                src: ['tests/**/*.js']
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
        },
        yuitest: {
            tests: {
                src: [
                    'tests/**/*.js'
                ]
            }
        },
        test_rhino: {
            tests: {
                src: [
                    '<%= concat.tests.dest %>',
                    'tests/all-rules.js'
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-include-replace');

    // Default task.
    grunt.registerTask('default', ['test']);
    
    //Testing
    grunt.registerTask('test', ['clean:build', 'jshint', 'concat', 'yuitest']);
    grunt.registerTask('rhino', ['clean:build', 'jshint', 'concat', 'test_rhino']);

    grunt.registerTask('release', ['test', 'clean:release', 'copy:release', 'includereplace:release', 'changelog']);
    
    //Run the YUITest suite
    grunt.registerMultiTask('yuitest', 'Run the YUITests for the project', function() {
        /*jshint evil:true, node: true */

        var start = Date.now();
        var YUITest = require("yuitest");
        var CSSLint = require('./build/csslint-node').CSSLint;
        var files = this.filesSrc;
        var TestRunner = YUITest.TestRunner;
        var done = this.async();
        
        //Eval each file so the tests are brought into this scope were CSSLint and YUITest are loaded already
        files.forEach(function(filepath) {
            eval(grunt.file.read(filepath));
        });
        
        //Generic test event handler for individual test
        function handleTestResult(data){ 
            switch(data.type) {
                case TestRunner.TEST_FAIL_EVENT:
                    grunt.verbose.fail("Test named '" + data.testName + "' failed with message: '" + data.error.message + "'.").or.write(".".red);
                    break;
                case TestRunner.TEST_PASS_EVENT:
                    grunt.verbose.ok("Test named '" + data.testName + "' passed.").or.write(".".green);
                    break;
                case TestRunner.TEST_IGNORE_EVENT:
                    grunt.verbose.warn("Test named '" + data.testName + "' was ignored.").or.write(".".yellow);
                    break;
            }
        }

        //Event to execute after all tests suites are finished
        function reportResults(allsuites) {
            var results = allsuites.results;
                grunt.log.write("\nTotal tests: " + results.total + ", Failures: " +
                    results.failed + ", Skipped: " + results.ignored +
                    ", Time: " + (results.duration/1000) + " seconds\n");
            
            //Tell grunt we're done the async testing
            done();
        }
        //Add event listeners
        TestRunner.subscribe(TestRunner.TEST_FAIL_EVENT, handleTestResult);
        TestRunner.subscribe(TestRunner.TEST_IGNORE_EVENT, handleTestResult);
        TestRunner.subscribe(TestRunner.TEST_PASS_EVENT, handleTestResult); 
        TestRunner.subscribe(TestRunner.COMPLETE_EVENT, reportResults); 
        TestRunner.run();
    });

    grunt.registerMultiTask('changelog', 'Write the changlog file', function() {
        var done = this.async();
        var lastTag;
        var files = this.filesSrc;
        
        
        grunt.util.spawn({
            cmd: 'git',
            args: ['tag']
        }, function(error, result, code) {
            //Find the latest git tag
            var tags = result.stdout.split("\n"),
                semver = tags[0].replace('v','').split('.'),
                major = parseInt(semver[0], 10),
                minor = parseInt(semver[1], 10),
                patch = parseInt(semver[2], 10);
            
            //A simple array sort can't be used because of the comparison of 
            //the strings '0.9.9' > '0.9.10'
            for (var i = 1, len = tags.length; i < len; i++) {
                semver = tags[i].replace('v','').split('.');
                
                var currentMajor = parseInt(semver[0], 10);
                if (currentMajor < major) {
                    continue;
                } else if (currentMajor > major) {
                    major = currentMajor;
                }
                
                var currentMinor = parseInt(semver[1], 10);
                if (currentMinor < minor) {
                    continue;
                } else if (currentMinor > minor) {
                    minor = currentMinor;
                }
                
                var currentPatch = parseInt(semver[2], 10);
                if (currentPatch < patch) {
                    continue;
                } else if (currentPatch > patch) {
                    patch = currentPatch;
                }
            }

            lastTag = 'v' + major + '.' + minor + '.' + patch;
            
            grunt.verbose.write('Last tag: ' + lastTag).writeln();
            
            //
            grunt.util.spawn({
                cmd: 'git',
                args: ['log', '--pretty=format:"* %s (%an)"', lastTag + '..HEAD']
            }, function(error, result, code) {
                var prettyPrint =  result.stdout.split('\"\n\"').join('\n').replace(/\"$/, '').replace(/^\"/, '');

                grunt.verbose.writeln().write(prettyPrint).writeln();

                var template = '<%= grunt.template.today("mmmm d, yyyy") %> - v<%= pkg.version %>\n\n' +
                    prettyPrint + '\n\n' +
                    grunt.file.read(files[0]);

                grunt.file.write(files[0], grunt.template.process(template));
                
                done();
            });         
        });

    });

    //Run test suite through rhino
    grunt.registerMultiTask('test_rhino', 'Run the test suite through rhino', function() {
        var done = this.async();
        var files = this.filesSrc;
        var progress = files.length;
        
        files.forEach(function(filepath) {
            grunt.util.spawn({
                cmd: 'java',
                args: ['-jar', 'lib/js.jar', 'lib/yuitest-rhino-cli.js', 'build/csslint.js', filepath],
                opts: {stdio: 'inherit'}
            }, function(error, result, code) {              
                progress--;
                if (progress === 0) {
                    done();
                }
            });
        });
    });
};
