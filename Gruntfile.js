/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: {
            compact: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> Nicole Sullivan and Nicholas C. Zakas;\n' +
                '* Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> <%= _.pluck(pkg.licenses, "url").join(", ") %> */\n',
            full: '/*!\n' +
                'CSSLint\n' +
                'Copyright (c) <%= grunt.template.today("yyyy") %> Nicole Sullivan and Nicholas C. Zakas. All rights reserved.\n' +
                '\n' +
                'Permission is hereby granted, free of charge, to any person obtaining a copy\n' +
                'of this software and associated documentation files (the "Software"), to deal\n' +
                'in the Software without restriction, including without limitation the rights\n' +
                'to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n' +
                'copies of the Software, and to permit persons to whom the Software is\n' +
                'furnished to do so, subject to the following conditions:\n' +
                '\n' +
                'The above copyright notice and this permission notice shall be included in\n' +
                'all copies or substantial portions of the Software.\n' +
                '\n' +
                'THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n' +
                'IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n' +
                'FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n' +
                'AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n' +
                'LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n' +
                'OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n' +
                'THE SOFTWARE.\n\n' +
                '*/\n' +
                '/* Build: v<%= pkg.version %> <%= grunt.template.today("dd-mmmm-yyyy hh:MM:ss") %> */'
        },
        build_dir: 'build',
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
            build: ['<%= build_dir %>'],
            release: ['release']
        },
        changelog: {
            dest: 'CHANGELOG'
        },
        concat: {
            core: {
                options: {
                    banner: '<%= banner.full %>\n' +
                            //Hack for using the node version of parserlib
                            'var exports = exports || {};\n' +
                            'var CSSLint = (function(){\n',
                    footer: '\nreturn CSSLint;\n})();'
                },
                src: [
                    '<%= core_files %>'
                ],
                dest: '<%= build_dir %>/<%= pkg.name %>.js'
            },//Build environment workers
            rhino: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/cli/common.js',
                    'src/cli/rhino.js'
                ],
                dest: '<%= build_dir %>/<%= pkg.name %>-rhino.js'
            },
            node: {
                options: {
                    banner: '<%= banner.full %>\n' +
                            'var parserlib = require("parserlib");\n',
                    footer: '\nexports.CSSLint = CSSLint;'
                },
                files: {
                    '<%= build_dir %>/<%= pkg.name %>-node.js': ['<%= csslint_files %>'],
                    '<%= build_dir %>/npm/lib/<%= pkg.name %>-node.js': ['<%= csslint_files %>']
                }
            },
            node_cli: {
                options: {
                    banner: '#!/usr/bin/env node\n<%= banner.full %>'
                },
                src: [
                    'src/cli/common.js',
                    'src/cli/node.js'
                ],
                dest: '<%= build_dir %>/npm/cli.js'
            },
            tests: {
                src: [
                    'tests/**/*.js',
                    '!tests/all-rules.js'
                ],
                dest: '<%= build_dir %>/<%= pkg.name %>-tests.js'
            },
            worker: {
                options: {
                    banner: '<%= banner.full %>\n' +
                            //Hack for using the node version of parserlib
                            'var exports = exports || {};\n'
                },
                src: [
                    '<%= core_files %>',
                    'src/worker/*.js'
                ],
                dest: '<%= build_dir %>/<%= pkg.name %>-worker.js'
            },
            wsh: {
                src: [
                    '<%= concat.core.dest %>',
                    'src/cli/common.js',
                    'src/cli/wsh.js'
                ],
                dest: '<%= build_dir %>/<%= pkg.name %>-wsh.js'
            }
        },
        copy: {
            release: {
                files: {
                    '<%= build_dir %>': 'release',
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
                src: '<%= build_dir %>/**/*.*',
                // Destinaion directory to copy files to
                dest: 'release/'
            }
        },
        jshint: {
            options: {
                curly: true,
                //eqeqeq: true, TODO: Leaving off due to errors
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                //unused: true, TODO: Leaving off due to errors around unused instances of CSSLint
                boss: true,
                eqnull: true,
                // Copied from build.xml
                forin: true,
                noempty: true,
                rhino: false,
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
    
    //Alias for 
    grunt.registerTask('lint', ['jshint']);
    
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
        var errors = [],
            failures = [],
            stack = [];
        
        //Eval each file so the tests are brought into this scope where CSSLint and YUITest are loaded already
        files.forEach(function(filepath) {
            eval(grunt.file.read(filepath));
        });
        
        // From YUITest Node CLI
        function filterStackTrace(stackTrace){
            if (stackTrace){
                var lines = stackTrace.split("\n"),
                    result = [],
                    i, len;

                //skip first line, it's the error
                for (i=1, len=lines.length; i < len; i++){
                    if (lines[i].indexOf("yuitest-node") > -1){
                        break;
                    } else {
                        result.push(lines[i]);
                    }
                }

                return result.join("\n");
            } else {
                return "Unavailable.";
            }
        }
        
        // From YUITest Node CLI with minor colourization changes
        function handleEvent(event){

            var message = "",
                results = event.results,
                i, len;

            switch(event.type){
                case TestRunner.BEGIN_EVENT:
                    message = "YUITest for Node.js\n";

                    if (TestRunner._groups){
                        message += "Filtering on groups '" + TestRunner._groups.slice(1,-1) + "'\n";
                    }
                    break;

                case TestRunner.COMPLETE_EVENT:
                    message = "\nTotal tests: " + results.total + ", " +
                        ("Failures: " + results.failed).red + ", " +
                        ("Skipped: " + results.ignored).yellow +
                        ", Time: " + (results.duration/1000) + " seconds\n";

                    if (failures.length){
                        message += "\nTests failed:\n".red;

                        for (i=0,len=failures.length; i < len; i++){
                            message += "\n" + (i+1) + ") " + failures[i].name + " : " + failures[i].error.getMessage() + "\n";
                            message += "Stack trace:\n" + filterStackTrace(failures[i].error.stack) + "\n";
                        }

                        message += "\n";
                    }

                    if (errors.length){
                        message += "\nErrors:\n".red;

                        for (i=0,len=errors.length; i < len; i++){
                            message += "\n" + (i+1) + ") " + errors[i].name + " : " + errors[i].error.message + "\n";
                            message += "Stack trace:\n" + filterStackTrace(errors[i].error.stack) + "\n";
                        }

                        message += "\n";
                    }

                    message += "\n\n";
                    //Tell grunt we're done the async operation
                    done();
                    break;

                case TestRunner.TEST_FAIL_EVENT:
                    message = "F".red;
                    failures.push({
                        name: stack.concat([event.testName]).join(" > "),
                        error: event.error
                    });

                    break;

                case TestRunner.ERROR_EVENT:
                    errors.push({
                        name: stack.concat([event.methodName]).join(" > "),
                        error: event.error
                    });

                    break;

                case TestRunner.TEST_IGNORE_EVENT:
                    message = "S".yellow;
                    break;

                case TestRunner.TEST_PASS_EVENT:
                    message = ".".green;
                    break;

                case TestRunner.TEST_SUITE_BEGIN_EVENT:
                    stack.push(event.testSuite.name);
                    break;

                case TestRunner.TEST_CASE_COMPLETE_EVENT:
                case TestRunner.TEST_SUITE_COMPLETE_EVENT:
                    stack.pop();
                    break;

                case TestRunner.TEST_CASE_BEGIN_EVENT:
                    stack.push(event.testCase.name);
                    break;

                //no default
            }

            grunt.log.write(message);
        }
        //Add event listeners
        TestRunner.subscribe(TestRunner.BEGIN_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_FAIL_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_PASS_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.ERROR_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_IGNORE_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_CASE_BEGIN_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_CASE_COMPLETE_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_SUITE_BEGIN_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.TEST_SUITE_COMPLETE_EVENT, handleEvent);
        TestRunner.subscribe(TestRunner.COMPLETE_EVENT, handleEvent);
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
