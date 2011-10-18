(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Adjoining Selector Rule Errors",
        
        "Adjoining classes should result in a warning": function(){
            var result = CSSLint.verify(".foo.bar { }", { "adjoining-classes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Don't use adjoining classes.", result.messages[0].message);
        },

        "Adjoining classes should result in an error": function(){
            var result = CSSLint.verify(".foo.bar { }", { "adjoining-classes": 2 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
            Assert.areEqual("Don't use adjoining classes.", result.messages[0].message);
        },

        "Descendant selector with classes should not result in a warning": function(){
            var result = CSSLint.verify(".foo .bar { }", { "adjoining-classes": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
