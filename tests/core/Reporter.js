(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Reporter Object Tests",

        "Report should cause a warning": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 1
            });
            reporter.report("Foo", 1, 1, {
                id: "fake-rule"
            });

            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("warning", reporter.messages[0].type);
        },

        "Report should cause an error": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 2
            });
            reporter.report("Foo", 1, 1, {
                id: "fake-rule"
            });

            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("error", reporter.messages[0].type);
        },

        "Calling error() should cause an error": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 1
            });
            reporter.error("Foo", 1, 1, {
                id: "fake-rule"
            });

            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("error", reporter.messages[0].type);
        },

        "Allow statement should drop message about specific rule on specific line but not other lines": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 1
            }, {
                "3": {
                    "fake-rule": true
                }
            });
            reporter.report("Foo", 2, 1, {
                id: "fake-rule"
            });
            reporter.report("Bar", 3, 1, {
                id: "fake-rule"
            });

            Assert.areEqual(1, reporter.messages.length);
        },

        "Allow statement should drop message about specific rule on specific line but not other rules": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 1,
                "fake-rule2": 1
            }, {
                "3": {
                    "fake-rule": true
                }
            });
            reporter.report("Foo", 3, 1, {
                id: "fake-rule"
            });
            reporter.report("Bar", 3, 1, {
                id: "fake-rule2"
            });

            Assert.areEqual(1, reporter.messages.length);
        },

        "Allow statement should drop messages about multiple rules on specific line": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 1,
                "fake-rule2": 1
            }, {
                "3": {
                    "fake-rule": true,
                    "fake-rule2": true
                }
            });
            reporter.report("Foo", 3, 1, {
                id: "fake-rule"
            });
            reporter.report("Bar", 3, 1, {
                id: "fake-rule2"
            });

            Assert.areEqual(0, reporter.messages.length);
        },

        "Ignores should step over a report in their range": function() {
            var reporter = new CSSLint._Reporter([], {
                "fake-rule": 1
            }, {}, [
                [1, 3]
            ]);
            reporter.report("Foo", 2, 1, {
                id: "fake-rule"
            });
            reporter.report("Bar", 5, 1, {
                id: "fake-rule"
            });

            Assert.areEqual(1, reporter.messages.length);
        }

    }));

})();
