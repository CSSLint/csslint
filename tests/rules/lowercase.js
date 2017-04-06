(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "lowercase rule errors",

        "A property that is not in lowercase should result in a warning": function() {
            var result = CSSLint.verify("h1 { Border-Radius: 5px; }", { "lowercase": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Property is not lowercase.", result.messages[0].message);
        },

        "A property that is in lowercase should not result in a warning": function() {
            var result = CSSLint.verify("h1 { border-radius: 5px; }", { "lowercase": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "A function that is not in lowercase should result in a warning": function() {
            var result = CSSLint.verify("h1 { color: RGB(0, 0, 0); }", { "lowercase": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Function is not lowercase.", result.messages[0].message);
        },

        "A function that is in lowercase should not result in a warning": function() {
            var result = CSSLint.verify("h1 { color: rgb(0, 0, 0); }", { "lowercase": 1 });

            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
