(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "rule-name",

        "Rule name must be concat with -, not _": function() {
            var result = CSSLint.verify(".foo_name { }", { "rule-name": 1 });
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule name must concat with -.", result.messages[0].message);
        }

    }));

})();
