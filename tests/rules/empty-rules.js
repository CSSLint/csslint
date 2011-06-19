(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Empty Rule Errors",

        "Empty rule should result in a warning": function(){
            var result = CSSLint.verify("li { }", { "empty-rules": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule is empty.", result.messages[0].message);
        }
    }));

})();
