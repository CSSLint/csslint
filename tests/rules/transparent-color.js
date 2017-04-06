(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "transparent color Errors",

        "A 'transparent' value for color should result in a warning": function() { 
            var result = CSSLint.verify("h1 { color: transparent; }", { "transparent-color": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Color cannot be 'transparent'.", result.messages[0].message);
        }
    }));
})();
