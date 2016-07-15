/* jshint camelcase:false, node:true */

"use strict";

module.exports = function(grunt) {

    // Force use of Unix newlines
    grunt.util.linefeed = "\n";

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON("package.json"),
        banner: "/*!\n" +
                "CSSLint v<%= pkg.version %>\n" +
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
                "*/\n",
        build_dir: "dist",
        // Parser lib copy for versions that can't use requirejs
        parserlib: "node_modules/parserlib/dist/node-parserlib.js",
        // clone copy for versions that can't use requirejs
        clone: "node_modules/clone/clone.js",
        // Core CSSLint files used by most versions
        csslint_files: [
            "src/core/CSSLint.js",
            "src/core/*.js",
            "src/rules/*.js",
            "src/formatters/*.js"
        ],
        // Core fileset used by most versions
        core_files: [
            "<%= parserlib %>",
            "<%= clone %>",
            "<%= csslint_files %>"
        ],

        // Task configuration.
        clean: {
            dist: "<%= build_dir %>"
        },

        changelog: {
            dest: "CHANGELOG"
        },

        concat: {
            core: {
                options: {
                    banner: "<%= banner %>\n" +
                            // Hack for using the node version of parserlib and clone
                            "var module = module || {},\n" +
                            "    exports = exports || {};\n\n" +
                            "var CSSLint = (function(){\n",
                    footer: "\nreturn CSSLint;\n})();"
                },
                src: [
                    "<%= core_files %>"
                ],
                dest: "<%= build_dir %>/csslint.js"
            }, // Build environment workers
            rhino: {
                src: [
                    "<%= concat.core.dest %>",
                    "src/cli/common.js",
                    "src/cli/rhino.js"
                ],
                dest: "<%= build_dir %>/csslint-rhino.js"
            },
            node: {
                options: {
                    banner: "<%= banner %>" +
                            "var clone = require('clone');\n" +
                            "var parserlib = require('parserlib');\n",
                    footer: "\nexports.CSSLint = CSSLint;"
                },
                src: "<%= csslint_files %>",
                dest: "<%= build_dir %>/csslint-node.js"
            },
            node_cli: {
                options: {
                    banner: "#!/usr/bin/env node\n<%= banner %>"
                },
                src: [
                    "src/cli/common.js",
                    "src/cli/node.js"
                ],
                dest: "<%= build_dir %>/cli.js"
            },
            tests: {
                src: [
                    "tests/**/*.js",
                    "!tests/all-rules.js"
                ],
                dest: "<%= build_dir %>/csslint-tests.js"
            },
            worker: {
                options: {
                    banner: "<%= banner %>" +
                            // Hack for using the node version of parserlib
                            "var exports = exports || {};\n"
                },
                src: [
                    "<%= core_files %>",
                    "src/worker/*.js"
                ],
                dest: "<%= build_dir %>/csslint-worker.js"
            },
            wsh: {
                src: [
                    "<%= concat.core.dest %>",
                    "src/cli/common.js",
                    "src/cli/wsh.js"
                ],
                dest: "<%= build_dir %>/csslint-wsh.js"
            }
        },

        includereplace: {
            dist: {
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
                    dest: "<%= build_dir %>/"
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
            core: {
                src: "src/**/*.js"
            },
            demo: {
                src: "demos/*.js"
            },
            tests: {
                options: {
                    jshintrc: "tests/.jshintrc"
                },
                src: "tests/**/*.js"
            }
        },

        watch: {
            gruntfile: {
                files: "<%= jshint.gruntfile.src %>",
                tasks: "jshint"
            },
            src: {
                files: "<%= jshint.all.src %>",
                tasks: "jshint:core"
            },
            lib_test: {
                files: "<%= jshint.tests.src %>",
                tasks: "jshint:tests"
            }
        },

        yuitest: {
            tests: {
                src: [
                    ["tests/**/*.js", "!tests/testrunner.js"]
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

    // Load any grunt plugins found in package.json.
    require("load-grunt-tasks")(grunt, { scope: "devDependencies" });
    require("time-grunt")(grunt);

    // Load custom tasks
    grunt.loadTasks("tasks");

    // Default task.
    grunt.registerTask("default", ["test"]);

    grunt.registerTask("build", ["clean", "concat", "includereplace"]);

    // Alias for
    grunt.registerTask("dist", "build");

    // Testing
    grunt.registerTask("test", ["build", "jshint", "yuitest"]);
    grunt.registerTask("rhino", ["build", "jshint", "test_rhino"]);

    grunt.registerTask("release", ["default", "changelog"]);
};
