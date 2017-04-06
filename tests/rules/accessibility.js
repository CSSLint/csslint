(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "accessibility rule errors",

        // overriding user stylesheets is tested using the "important" rule - see notes in the "accessibility" rule

        // background and foreground color
        "background color specified in shorthand without color should result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #f00 url('smiley.gif') no-repeat fixed center;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Explicitly set color any time background color is used.", result.messages[0].message);
        },

        "background-color without color should result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: #f00;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Explicitly set color any time background color is used.", result.messages[0].message);
        },

        "background specified without enough color contrast should result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #fff url('smiley.gif') no-repeat fixed center; color: #fff;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("There is not enough contrast between background and foreground colors.", result.messages[0].message);
        },

        "background-color without enough color contrast should result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: rgb(255, 255, 255); color: rgb(200, 200, 200);}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("There is not enough contrast between background and foreground colors.", result.messages[0].message);
        },

        "background with enough color contrast should not result in a warning": function() {
            var result = CSSLint.verify(".foo{background: #fff url('smiley.gif') no-repeat fixed center; color: #000;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "background-color with enough color contrast should not result in a warning": function() {
            var result = CSSLint.verify(".foo{background-color: #fff; color: #000;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // content
        "specifying content should result in a warning": function() {
            var result = CSSLint.verify(".foo{content:'anything';}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Content specified in a stylesheet is not available to assistive technology.", result.messages[0].message);
        },

        // display
        "display none should result in a warning": function() {
            var result = CSSLint.verify(".foo{display: none;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Hidden content is not accessible.", result.messages[0].message);
        },

        "display values other than none should not result in a warning": function() {
            var result = CSSLint.verify(".foo{display: block; display: inline-block; display: inline;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // absolute lengths
        "absolute lengths for font-size should result in an error": function() {
            var result = CSSLint.verify(".foo{font-size: 16px;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Absolute lengths are not accessible.", result.messages[0].message);
        },

        "relative lengths for font-size should not result in an error": function() {
            var result = CSSLint.verify(".foo{font-size: 1em;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "absolute lengths for margin should result in an error": function() {
            var result = CSSLint.verify(".foo{margin: 3px;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Absolute lengths are not accessible.", result.messages[0].message);
        },

        "relative lengths for margin should not result in an error": function() {
            var result = CSSLint.verify(".foo{margin: 1em;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "absolute lengths for padding should result in an error": function() {
            var result = CSSLint.verify(".foo{padding: 3px;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Absolute lengths are not accessible.", result.messages[0].message);
        },

        "relative lengths for padding should not result in an error": function() {
            var result = CSSLint.verify(".foo{padding: 1em;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // height and width of zero
        "height of zero should result in a warning": function() {
            var result = CSSLint.verify(".foo{height: 0;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Hidden content is not accessible.", result.messages[0].message);
        },

        "non-zero height should not result in a warning": function() {
            var result = CSSLint.verify(".foo{height: 1em;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        "width of zero should result in a warning": function() {
            var result = CSSLint.verify(".foo{width: 0;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Hidden content is not accessible.", result.messages[0].message);
        },

        "non-zero width should not result in a warning": function() {
            var result = CSSLint.verify(".foo{width: 1em;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // outline should not be used alone
        "outline used alone should result in a warning": function() {
            var result = CSSLint.verify(".foo{outline: none;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outline should not be hidden without other visual changes.", result.messages[0].message);
        },

        "outline used with other properties should not result in a warning": function() {
            var result = CSSLint.verify(".foo{font-weight: bold; outline: none;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // hidden overflow
        "hidden overflow should result in a warning": function() {
            var result = CSSLint.verify(".foo{overflow: hidden;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Hidden content is not accessible.", result.messages[0].message);
        },
        "non-hidden overflow should not result in a warning": function() {
            var result = CSSLint.verify(".foo{overflow: auto; overflow: visible; overflow: scroll;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // absolutely positioned elements
        "absolutely positioned elements should result in a warning": function() {
            var result = CSSLint.verify(".foo{position: absolute;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Discoverability of absolutely positioned content may problematic.", result.messages[0].message);
        },

        "non-absolutely positioned elements should not result in a warning": function() {
            var result = CSSLint.verify(".foo{position: relative; position: static;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        },

        // visibility
        "visibility hidden should result in a warning": function() {
            var result = CSSLint.verify(".foo{visibility: hidden;}", { "accessibility": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Hidden content is not accessible.", result.messages[0].message);
        },

        "visibility visible should not result in a warning": function() {
            var result = CSSLint.verify(".foo{visibility: visible;}", { "accessibility": 1 });

            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
