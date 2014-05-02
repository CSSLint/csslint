(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Reporter Object Tests",

        "Report should cause a warning": function(){
            var reporter = new CSSLint._Reporter([], { "fake-rule": 1});
            reporter.report("Foo", 1, 1, { id: "fake-rule" });

            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("warning", reporter.messages[0].type);
        },

        "Report should cause an error": function(){
            var reporter = new CSSLint._Reporter([], { "fake-rule": 2});
            reporter.report("Foo", 1, 1, { id: "fake-rule" });

            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("error", reporter.messages[0].type);
        },

        "Calling error() should cause an error": function(){
            var reporter = new CSSLint._Reporter([], { "fake-rule": 1});
            reporter.error("Foo", 1, 1, { id: "fake-rule" });

            Assert.areEqual(1, reporter.messages.length);
            Assert.areEqual("error", reporter.messages[0].type);
        }

    }));

})();
