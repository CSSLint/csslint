(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "font-faces Rule Errors",

        "5 font-faces should result in a warning": function(){
            var result = CSSLint.verify("@font-face{ } @font-face{ } @font-face{ } @font-face{ } @font-face{ }", { "font-faces": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "4 font-faces should not result in a warning": function(){
            var result = CSSLint.verify("@font-face{} @font-face{} @font-face{} @font-face{}", { "font-faces": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "6 font-faces should result in a warning": function(){
            var result = CSSLint.verify("@font-face{} @font-face{} @font-face{} @font-face{} @font-face{} @font-face{}", { "font-faces": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Too many @font-face declarations (6).", result.messages[0].message);
        }
    }));

})();
