(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Import Rule Errors",
        
        "Using @import should result in a warning": function(){
            var result = CSSLint.verify("@import url('foo.css');", { "import": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("@import prevents parallel downloads, use <link> instead.", result.messages[0].message);
        }
    }));

})();
