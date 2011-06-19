(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Parsing Errors",

        "Parsing error should result in one parsing error message": function(){
            var result = CSSLint.verify("li { float left;}", { errors: 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
        }
    }));

})();
