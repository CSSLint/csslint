(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "CSSLint object tests",

        "Adjoining classes should not cause an error": function(){
            var result = CSSLint.verify(".foo.bar{}", { });
            Assert.areEqual(0, result.messages.length);
        },

        "@media (max-width:400px) should not cause an error": function(){
            var result = CSSLint.verify("@media (max-width:400px) {}", { });
            Assert.areEqual(0, result.messages.length);
        },

        "Embedded ruleset should be honored": function(){
            var result = CSSLint.verify("/*csslint bogus, adjoining-classes:true, box-sizing:false */\n.foo.bar{}", {
                "text-indent": 1,
                "box-sizing": 1
            });

            Assert.areEqual(2, result.ruleset["adjoining-classes"]);
            Assert.areEqual(1, result.ruleset["text-indent"]);
            Assert.areEqual(0, result.ruleset["box-sizing"]);
        },

        "Embedded rulesets should not have the side-effect of modifying the ruleset object passed in by the caller of verify()": function(){
            var ruleset = {
                "text-indent": 1,
                "box-sizing": 1
            };
            CSSLint.verify("/*csslint bogus, adjoining-classes:true, box-sizing:false */\n.foo.bar{}", ruleset);

            Assert.areEqual(undefined, ruleset["adjoining-classes"]);
            Assert.areEqual(1, ruleset["text-indent"]);
            Assert.areEqual(1, ruleset["box-sizing"]);
        }

    }));

})();
