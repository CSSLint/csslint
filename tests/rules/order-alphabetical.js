(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Alphabetical order Errors",

        "Rules with properties not in alphabetical order should result in a warning": function() {
            var result = CSSLint.verify("li { z-index: 2; color: red; }", { "order-alphabetical": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule doesn't have all its properties in alphabetical order.", result.messages[0].message);
        },

        "Rules with prefixed properties not in alphabetical order (without the prefix) should result in a warning": function() {
            var result = CSSLint.verify("li { -moz-transition: none; -webkit-box-shadow: none; }", { "order-alphabetical": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule doesn't have all its properties in alphabetical order.", result.messages[0].message);
        },

        "Rules with properties in alphabetical order should not result in a warning": function() {
            var result = CSSLint.verify("li { box-shadow: none; color: red; transition: none; }", { "order-alphabetical": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Rules with prefixed properties in alphabetical order should not result in a warning": function() {
            var result = CSSLint.verify("li { -webkit-box-shadow: none; color: red; -moz-transition: none; }", { "order-alphabetical": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
