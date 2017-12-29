(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "font-size Rule Errors",

        "10 font-sizes should result in a warning": function() {
            var result = CSSLint.verify(".foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", { "font-sizes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many font-size declarations (10), abstraction needed.", result.messages[0].message);
        },

        "9 font-sizes should not result in a warning": function() {
            var result = CSSLint.verify(" .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", { "font-sizes": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "11 font-sizes should result in a warning": function() {
            var result = CSSLint.verify(".foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } .foo { font-size: 10px; } ", { "font-sizes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many font-size declarations (11), abstraction needed.", result.messages[0].message);
        },

        "Ignore should remove rollup warning message for font-sizes": function() {
            var report = CSSLint.verify("/* csslint ignore:start */\n.test1 {font-size: 10px;}\n.test2 {font-size: 10px;}\n.test3 {font-size: 10px;}\n.test4 {font-size: 10px;}\n.test5 {font-size: 10px;}\n.test6 {font-size: 10px;}\n.test7 {font-size: 10px;}\n.test8 {font-size: 10px;}\n.test9 {font-size: 10px;}\n.test10 {font-size: 10px;}\n.test11 {font-size: 10px;}\n/* csslint ignore:end */h2 {color: #fff}\n");
            Assert.areEqual(0, report.messages.length);
        }
    }));

})();
