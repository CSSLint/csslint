(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "CSSLint object tests",

        "Adjoining classes should not cause an error": function() {
            var result = CSSLint.verify(".foo.bar{}", {});
            Assert.areEqual(0, result.messages.length);
        },

        "@media (max-width:400px) should not cause an error": function() {
            var result = CSSLint.verify("@media (max-width:400px) {}", {});
            Assert.areEqual(0, result.messages.length);
        },

        "Embedded ruleset should be honored": function() {
            var result = CSSLint.verify("/*csslint bogus, adjoining-classes:true, box-sizing:false */\n.foo.bar{}", {
                "text-indent": 1,
                "box-sizing": 1
            });

            Assert.areEqual(2, result.ruleset["adjoining-classes"]);
            Assert.areEqual(1, result.ruleset["text-indent"]);
            Assert.areEqual(0, result.ruleset["box-sizing"]);
        },

        "Embedded rulesets should not have the side-effect of modifying the ruleset object passed in by the caller of verify()": function() {
            var ruleset = {
                "text-indent": 1,
                "box-sizing": 1
            };
            CSSLint.verify("/*csslint bogus, adjoining-classes:true, box-sizing:false */\n.foo.bar{}", ruleset);

            Assert.areEqual(undefined, ruleset["adjoining-classes"]);
            Assert.areEqual(1, ruleset["text-indent"]);
            Assert.areEqual(1, ruleset["box-sizing"]);
        },

        "Embedded rulesets should accept whitespace between /* and 'csslint'": function() {
            var result = CSSLint.verify("/*     csslint bogus, adjoining-classes:true, box-sizing:false */\n.foo.bar{}", {
                "text-indent": 1,
                "box-sizing": 1
            });

            Assert.areEqual(2, result.ruleset["adjoining-classes"]);
            Assert.areEqual(1, result.ruleset["text-indent"]);
            Assert.areEqual(0, result.ruleset["box-sizing"]);
        },

        "Allow statement on one line with one rule should be added to report": function() {
            var report = CSSLint.verify(".foo.bar{}\n.baz.qux{} /* csslint allow: box-sizing */\nquux.corge{}");
            Assert.isTrue(report.allow.hasOwnProperty("2"));
            Assert.isTrue(report.allow["2"].hasOwnProperty("box-sizing"));
        },

        "Allow statement on one line with multiple rules should be added to report": function() {
            var report = CSSLint.verify(".foo.bar{}\n.baz.qux{} /* csslint allow: box-sizing, box-model */\nquux.corge{}");
            Assert.isTrue(report.allow.hasOwnProperty("2"));
            Assert.isTrue(report.allow["2"].hasOwnProperty("box-sizing"));
            Assert.isTrue(report.allow["2"].hasOwnProperty("box-model"));
        },

        "Allow statements on multiple lines for different rules should be added to report": function() {
            var report = CSSLint.verify(".foo.bar{}\n.baz.qux{} /* csslint allow: box-sizing */\nquux.corge{}\ngrault.garply{} /* csslint allow: box-model */");
            Assert.isTrue(report.allow.hasOwnProperty("2"));
            Assert.isTrue(report.allow["2"].hasOwnProperty("box-sizing"));
            Assert.isTrue(report.allow.hasOwnProperty("4"));
            Assert.isTrue(report.allow["4"].hasOwnProperty("box-model"));
        },

        "Full ignore blocks should be captured": function() {
            var report = CSSLint.verify("/* csslint ignore:start */\n\n/* csslint ignore:end */");
            Assert.areEqual(1, report.ignore.length);
            Assert.areEqual(0, report.ignore[0][0]);
            Assert.areEqual(2, report.ignore[0][1]);
        },

        "Whitespace should be no problem inside ignore comments": function() {
            var report = CSSLint.verify("/*     csslint     ignore:start    */\n\n/*    csslint     ignore:end     */,\n/*csslint ignore:start*/\n/*csslint ignore:end*/");
            Assert.areEqual(2, report.ignore.length);
            Assert.areEqual(0, report.ignore[0][0]);
            Assert.areEqual(2, report.ignore[0][1]);
            Assert.areEqual(3, report.ignore[1][0]);
            Assert.areEqual(4, report.ignore[1][1]);
        },

        "Ignore blocks should be autoclosed": function() {
            var report = CSSLint.verify("/* csslint ignore:start */\n\n");
            Assert.areEqual(1, report.ignore.length);
            Assert.areEqual(0, report.ignore[0][0]);
            Assert.areEqual(3, report.ignore[0][1]);
        },

        "Restarting ignore should be harmless": function() {
            var report = CSSLint.verify("/* csslint ignore:start */\n/* csslint ignore:start */\n");
            Assert.areEqual(1, report.ignore.length);
            Assert.areEqual(0, report.ignore[0][0]);
        }

    }));

})();
