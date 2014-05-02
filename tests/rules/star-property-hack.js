(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "star-property-hack Rule Errors",

        "a property with a star prefix should result in a warning": function(){
            var result = CSSLint.verify(".foo{*width: 100px;}", {"star-property-hack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Property with star prefix found.", result.messages[0].message);
        },

        "a property without a star prefix should not result in a warning": function(){
            var result = CSSLint.verify(".foo{width: 100px;}", {"star-property-hack": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
