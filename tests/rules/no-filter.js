(function() {
    "use strict";

    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Unstable filter property",

        "Use of 'filter' should result in a warning": function() {
            var result = CSSLint.verify("h1 { filter: alpha(opacity=40); }", { "no-filter": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The filter property is not allowed", result.messages[0].message);
        }
    }));
})();

