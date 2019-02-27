(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "multi-rules-newline",

        "Multi rules must declear in multi lines": function() {
            var result = CSSLint.verify(".foo.bar, .hehe { }", { "multi-rules-newline": 1 });
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Multi rules must declear in multi lines.", result.messages[0].message);
        }

    }));

})();
