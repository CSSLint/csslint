(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Compact formatter",

        "File with no problems should say so": function() {
            var result = {
                    messages: [],
                    stats: []
                },
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                });
            Assert.areEqual("path/to/FILE: Lint Free!", actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = {
                    messages: [],
                    stats: []
                },
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE",
                    quiet: "true"
                });
            Assert.areEqual("", actual);
        },

        "File with problems should list them": function() {
            var result = {
                    messages: [{
                        type: "error",
                        line: 2,
                        col: 1,
                        message: "BOGUS ERROR",
                        evidence: "BOGUS",
                        rule: {
                            id: "BOGUS_RULE_ID"
                        }
                    }, {
                        type: "warning",
                        line: 1,
                        col: 1,
                        message: "BOGUS WARNING",
                        evidence: "BOGUS",
                        rule: {
                            id: "BOGUS_RULE_ID"
                        }
                    }, {
                        type: "warning",
                        rollup: true,
                        message: "BOGUS ROLLUP WARNING",
                        evidence: "BOGUS",
                        rule: {
                            id: "BOGUS_RULE_ID"
                        }
                    }],
                    stats: []
                },
                err = "path/to/FILE: line 2, col 1, Error - BOGUS ERROR (BOGUS_RULE_ID)\n",
                warning = "path/to/FILE: line 1, col 1, Warning - BOGUS WARNING (BOGUS_RULE_ID)\n",
                rollupwarning = "path/to/FILE: Warning - BOGUS ROLLUP WARNING (BOGUS_RULE_ID)\n",
                expected = err + warning + rollupwarning,
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                });
            Assert.areEqual(expected, actual);
        },

        "Should output relative file paths": function() {
            var result = {
                    messages: [{
                        type: "error",
                        line: 2,
                        col: 1,
                        message: "BOGUS ERROR",
                        evidence: "BOGUS",
                        rule: {
                            id: "BOGUS_RULE_ID"
                        }
                    }, {
                        type: "warning",
                        line: 1,
                        col: 1,
                        message: "BOGUS WARNING",
                        evidence: "BOGUS",
                        rule: {
                            id: "BOGUS_RULE_ID"
                        }
                    }, {
                        type: "warning",
                        rollup: true,
                        message: "BOGUS ROLLUP WARNING",
                        evidence: "BOGUS",
                        rule: {
                            id: "BOGUS_RULE_ID"
                        }
                    }],
                    stats: []
                },
                err = "path/to/FILE: line 2, col 1, Error - BOGUS ERROR (BOGUS_RULE_ID)\n",
                warning = "path/to/FILE: line 1, col 1, Warning - BOGUS WARNING (BOGUS_RULE_ID)\n",
                rollupwarning = "path/to/FILE: Warning - BOGUS ROLLUP WARNING (BOGUS_RULE_ID)\n",
                expected = err + warning + rollupwarning,
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                });
            Assert.areEqual(expected, actual);
        }

    }));

})();
