(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "color-contrast rule errors",

        "background specified without enough color contrast should result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #fff url('smiley.gif') no-repeat fixed center; color: #c8c8c8;}", { "color-contrast": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("There is not enough contrast between background and foreground colors.", result.messages[0].message);
        },

        "background-color without enough color contrast should result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: rgb(255, 255, 255); color: rgb(200, 200, 200);}", { "color-contrast": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("There is not enough contrast between background and foreground colors.", result.messages[0].message);
        },

        "background with enough color contrast should not result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #fff url('smiley.gif') no-repeat fixed center; color: #000;}", { "background-color": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "background-color with enough color contrast should not result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: #fff; color: #000;}", { "background-color": 1 });

            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
