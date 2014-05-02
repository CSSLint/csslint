(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Regex Selectors Errors",

        "Using |= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class|=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with |= are slow!", result.messages[0].message);
        },

        "Using *= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class*=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with *= are slow!", result.messages[0].message);
        },

        "Using $= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class$=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with $= are slow!", result.messages[0].message);
        },

        "Using ~= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class~=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with ~= are slow!", result.messages[0].message);
        },

        "Using ^= in an attribute selector should result in one warning": function(){
            var result = CSSLint.verify("li[class^=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Attribute selectors with ^= are slow!", result.messages[0].message);
        },

        "Using = in an attribute selector should not result in a warning": function(){
            var result = CSSLint.verify("li[class=foo]{ color: red; }", { "regex-selectors": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
