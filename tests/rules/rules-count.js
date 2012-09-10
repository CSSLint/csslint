(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Rule Count Errors",

        "Rules should be counted": function(){
            var result = CSSLint.verify("h1 { color:#fff; }.foo{color: red;}", { "rules-count": 1});
            // console.dir(result);
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("This CSS contains 2 rules.", result.messages[0].message);
        }

    }));

})();
