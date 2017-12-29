(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Floats Rule Errors",

        "10 floats should result in a warning": function() {
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many floats (10), you're probably using them for layout. Consider using a grid system instead.", result.messages[0].message);
        },

        "9 floats should not result in a warning": function() {
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "11 floats should result in a warning": function() {
            var result = CSSLint.verify(".foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many floats (11), you're probably using them for layout. Consider using a grid system instead.", result.messages[0].message);
        },

        "float: none should not count and therefore should not result in a warning": function() {
            var result = CSSLint.verify(".foo { float: none; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; } .foo { float: left; }", { "floats": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Ignore should remove rollup warning message for floats": function() {
            var report = CSSLint.verify("/* csslint ignore:start */\n.test1 {float:left}\n.test2 {float:left}\n.test3 {float:left}\n.test4 {float:left}\n.test5 {float:left}\n.test6 {float:left}\n.test7 {float:left}\n.test8 {float:left}\n.test9 {float:left}\n.test10 {float:left}\n.test11 {float:left}\n/* csslint ignore:end */h2 {color: #fff}\n");
            Assert.areEqual(0, report.messages.length);
        }
    }));

})();
