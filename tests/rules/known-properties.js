(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Known Properties Errors",

        "Using an unknown property should result in a warning": function(){
            var result = CSSLint.verify("h1 { foo: red;}", { "known-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Unknown property 'foo'.", result.messages[0].message);
        },

        "Using a known property should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;}", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a known property with the star hack should not result in a warning": function(){
            var result = CSSLint.verify("h1 { *color: red;}", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a known property with the underscore hack should not result in a warning": function(){
            var result = CSSLint.verify("h1 { _color: red;}", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using a vendor-prefix property should not result in a warning": function(){
            var result = CSSLint.verify("h2 { -moz-border-radius: 5px; }", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using src in @font-face should not result in a warning": function(){
            var result = CSSLint.verify("@font-face { src: url(foo.otf); }", { "known-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
