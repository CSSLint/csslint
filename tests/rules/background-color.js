(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "background-color Rule Errors",

        "background color specified in shorthand without color should result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #f00 url('smiley.gif') no-repeat fixed center;}", { "background-color": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Explicitly set color any time background color is used.", result.messages[0].message);
        },

        "background-color without color should result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: #f00;}", { "background-color": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Explicitly set color any time background color is used.", result.messages[0].message);
        },

        "background color specified in shorthand with same color value should result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #f00 url('smiley.gif') no-repeat fixed center; color: #f00;}", { "background-color": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Text color is the same as the background color.", result.messages[0].message);
        },

        "background-color with same color value should result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: #f00; color: #f00;}", { "background-color": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Text color is the same as the background color.", result.messages[0].message);
        },

        "background color specified in shorthand with different color should not result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #f00 url('smiley.gif') no-repeat fixed center; color: rgb(255, 255, 0);}", { "background-color": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "background-color with different color should not result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: #f00; color: rgb(255, 255, 0);}", { "background-color": 1 });

            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
