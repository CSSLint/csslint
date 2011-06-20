(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Qualified Headings Errors",

        "Using a heading as a descendant should result in one warning": function(){
            var result = CSSLint.verify("li h3{ float: left;}", { "qualified-headings": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h3) should not be qualified.", result.messages[0].message);
        }

    }));

})();
