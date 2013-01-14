(function(){

    /*global YUITest, CSSLint*/
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
            var result = CSSLint.verify(
                "/*csslint adjoining-classes:true, box-sizing:false */\n.foo.bar{}",
                { 'text-indent': 2 }
            );

            Assert.areEqual(2, result.ruleset['adjoining-classes']);
            Assert.areEqual(undefined, result.ruleset['box-sizing']);
            Assert.areEqual(1, result.ruleset['text-indent']);
        }

    }));

})();
