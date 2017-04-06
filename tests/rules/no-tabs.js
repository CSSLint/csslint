(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "no-tabs rule errors",

        "tabs in a stylesheet": function() {
            var result = CSSLint.verify(".foo{\ttext-indent: -100px;}", { "no-tabs": 1 });

            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The TAB character is not allowed.", result.messages[0].message);
        }

    }));

})();
