(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Universal Selector Errors",

        "Using a universal selector alone should result in a warning": function(){
            var result = CSSLint.verify("* { font-size: 10px; }", {"universal-selector": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The universal selector (*) is known to be slow.", result.messages[0].message);
        },

        "Using a universal selector as the right-most part should result in a warning": function(){
            var result = CSSLint.verify("p div * { font-size: 10px; }", {"universal-selector": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The universal selector (*) is known to be slow.", result.messages[0].message);
        },

        "Using a universal selector in the middle should not result in a warning": function(){
            var result = CSSLint.verify("* .foo { font-size: 10px; } ", {"universal-selector": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
