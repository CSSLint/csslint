/* jshint camelcase:false, node:true */

"use strict";

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON("package.json"),
        banner: {
            compact: "/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - " +
                "<%= grunt.template.today('yyyy-mm-dd') %>\n" +
                "<%= pkg.homepage ? '* ' + pkg.homepage + '\\n' : '' %>" +
                "* Copyright (c) <%= grunt.template.today('yyyy') %> Nicole Sullivan and Nicholas C. Zakas;\n" +
                "* Licensed <%= _.pluck(pkg.licenses, 'type').join(', ') %> <%= _.pluck(pkg.licenses, 'url').join(', ') %> */\n",
            full: "/*!\n" +
                "CSSLint\n" +
                "Copyright (c) <%= grunt.template.today('yyyy') %> Nicole Sullivan and Nicholas C. Zakas. All rights reserved.\n" +
                "\n" +
                "Permission is hereby granted, free of charge, to any person obtaining a copy\n" +
                "of this software and associated documentation files (the 'Software'), to deal\n" +
                "in the Software without restriction, including without limitation the rights\n" +
                "to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n" +
                "copies of the Software, and to permit persons to whom the Software is\n" +
                "furnished to do so, subject to the following conditions:\n" +
                "\n" +
                "The above copyright notice and this permission notice shall be included in\n" +
                "all copies or substantial portions of the Software.\n" +
                "\n" +
                "THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n" +
                "IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n" +
                "FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n" +
                "AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n" +
                "LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n" +
                "OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n" +
                "THE SOFTWARE.\n\n" +
                "*/\n" +
                "/* Build: v<%= pkg.version %> <%= grunt.template.today('dd-mmmm-yyyy hh:MM:ss') %> */"
        },
        build_dir: "build",
        //Parser lib copy for versions that can't use requirejs
        parserlib: "node_modules/parserlib/lib/node-parserlib.js",
        //clone copy for versions that can't use requirejs
        clone: "node_modules/clone/clone.js",
        //Core CSSLint files used by most versions
        csslint_files: [
            "src/core/CSSLint.js",
            "src/core/*.js",
            "src/rules/*.js",
            "src/formatters/*.js"
        ],
        //Core fileset used by most versions
        core_files: [
            "<%= parserlib %>",
            "<%= clone %>",
            "<%= csslint_files %>"
        ],
        // Task configuration.
        clean: {
            build: ["<%= build_dir %>"],
            release: ["release"]
        },
        changelog: {
            dest: "CHANGELOG"
        },
        concat: {
            core: {
                options: {
                    banner: "<%= banner.full %>\n" +
                            //Hack for using the node version of parserlib
                            "var exports = exports || {};\n" +
                            "var CSSLint = (function(){\n",
                    footer: "\nreturn CSSLint;\n})();"
                },
                src: [
                    "<%= core_files %>"
                ],
                dest: "<%= build_dir %>/<%= pkg.name %>.js"
            },//Build environment workers
            rhino: {
                src: [
                    "<%= concat.core.dest %>",
                    "src/cli/common.js",
                    "src/cli/rhino.js"
                ],
                dest: "<%= build_dir %>/<%= pkg.name %>-rhino.js"
            },
            node: {
                options: {
                    banner: "<%= banner.full %>\n" +
                            "var clone = require('clone');\n" +
                            "var parserlib = require('parserlib');\n",
                    footer: "\nexports.CSSLint = CSSLint;"
                },
                files: {
                    "<%= build_dir %>/<%= pkg.name %>-node.js": ["<%= csslint_files %>"],
                    "<%= build_dir %>/npm/lib/<%= pkg.name %>-node.js": ["<%= csslint_files %>"]
                }
            },
            node_cli: {
                options: {
                    banner: "#!/usr/bin/env node\n<%= banner.full %>"
                },
                src: [
                    "src/cli/common.js",
                    "src/cli/node.js"
                ],
                dest: "<%= build_dir %>/npm/cli.js"
            },
            tests: {
                src: [
                    "tests/**/*.js",
                    "!tests/all-rules.js"
                ],
                dest: "<%= build_dir %>/<%= pkg.name %>-tests.js"
            },
            worker: {
                options: {
                    banner: "<%= banner.full %>\n" +
                            //Hack for using the node version of parserlib
                            "var exports = exports || {};\n"
                },
                src: [
                    "<%= core_files %>",
                    "src/worker/*.js"
                ],
                dest: "<%= build_dir %>/<%= pkg.name %>-worker.js"
            },
            wsh: {
                src: [
                    "<%= concat.core.dest %>",
                    "src/cli/common.js",
                    "src/cli/wsh.js"
                ],
                dest: "<%= build_dir %>/<%= pkg.name %>-wsh.js"
            }
        },
        copy: {
            build: {
              expand: true,
              cwd: "<%= build_dir %>/",
              src: "**/*",
              dest: "release/"
            },
            npm: {
              expand: true,
              src: ["README.md", "package.json"],
              dest: "release/npm/"
            }
        },
        includereplace: {
            release: {
                options: {
                    // Global variables available in all files
                    globals: {
                        VERSION: "<%= pkg.version %>"
                    },
                    prefix: "@",
                    suffix: "@"
                },
                files: [{
                    expand: true,
                    cwd: "<%= build_dir %>/",
                    src: "**/*",
                    dest: "release/"
                }]
            }
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            gruntfile: {
                src: ["Gruntfile.js", "tasks/*.js"]
            },
            demo: {
                src: "demos/*.js"
            },
            all: {
                src: "src/**/*.js"
            },
            tests: {
                src: "tests/**/*.js"
            }
        },
        watch: {
            gruntfile: {
                files: "<%= jshint.gruntfile.src %>",
                tasks: ["jshint"]
            },
            src: {
                files: "<%= jshint.all.src %>",
                tasks: ["jshint:all"]
            },
            lib_test: {
                files: "<%= jshint.tests.src %>",
                tasks: ["jshint:tests"]
            }
        },
        yuitest: {
            tests: {
                src: [
                    "tests/**/*.js"
                ]
            }
        },
        test_rhino: {
            tests: {
                src: [
                    "<%= concat.tests.dest %>",
                    "tests/all-rules.js"
                ]
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-include-replace");

    // Load custom tasks
    grunt.loadTasks("tasks");

    // Default task.
    grunt.registerTask("default", ["test"]);

    // Alias for
    grunt.registerTask("lint", ["jshint"]);

    // Testing
    grunt.registerTask("test", ["clean:build", "jshint", "concat", "yuitest"]);
    grunt.registerTask("rhino", ["clean:build", "jshint", "concat", "test_rhino"]);

    grunt.registerTask("release", ["test", "clean:release", "copy", "includereplace:release", "changelog"]);
};
