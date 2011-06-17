(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "IDs Rule Errors",

        "Using an ID should result in one warning": function(){
            var result = CSSLint.verify("#foo { float: left;}", { ids: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Don't use IDs in selectors.", result.messages[0].message);
        },

        "Using multiple IDs should result in one warning": function(){
            var result = CSSLint.verify("#foo #bar { float: left;}", { ids: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("2 IDs in the selector, really?", result.messages[0].message);
        }
    }));

})();
