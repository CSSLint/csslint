/* jshint evil:true, node:true */
"use strict";

module.exports = function(grunt) {
    grunt.registerMultiTask("yuitest", "Run the YUITests for the project", function() {

        var YUITest = require("yuitest");
        var CSSLint = require("../dist/csslint-node").CSSLint;  // jshint ignore:line
        var files = this.filesSrc;
        var TestRunner = YUITest.TestRunner;
        var done = this.async();
        var failures = [],
            stack = [];

        // Eval each file so the tests are brought into this scope where CSSLint and YUITest are loaded already
        files.forEach(function(filepath) {
            eval(grunt.file.read(filepath));
        });

        // From YUITest Node CLI with minor colourization changes
        function handleEvent(event) {

            var message = "",
                results = event.results,
                i, len, gruntFailMessage;

            switch (event.type) {
                case TestRunner.BEGIN_EVENT:
                    grunt.verbose.subhead("YUITest for Node.js");

                    if (TestRunner._groups) {
                        grunt.verbose.writeln("Filtering on groups '" + TestRunner._groups.slice(1, -1) + "'");
                    }
                    break;

                case TestRunner.COMPLETE_EVENT:
                    grunt.log.writeln("Total tests: " + results.total + ", " +
                        ("Failures: " + results.failed).red + ", " +
                        ("Skipped: " + results.ignored).yellow +
                        ", Time: " + results.duration / 1000 + " seconds\n");

                    if (failures.length) {
                        grunt.log.writeln("Tests failed:");

                        for (i=0, len=failures.length; i < len; i++) {
                            gruntFailMessage += failures[i].name + "\n" + failures[i].error;
                        }
                        grunt.fail.warn(gruntFailMessage);
                    }

                    // Tell grunt we're done the async operation
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
                    grunt.fail.fatal(event.error, stack);
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

                // no default
            }

            grunt.log.write(message);
        }
        // Add event listeners
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
};
