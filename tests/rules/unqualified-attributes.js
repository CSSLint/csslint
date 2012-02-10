(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Unqualified Attributes Errors",

        "Using an unqualified attribute selector alone should result in a warning": function(){
            var result = CSSLint.verify("[type=text] { font-size: 10px; }", {"unqualified-attributes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Unqualified attribute selectors are known to be slow.", result.messages[0].message);
        },

        "Using an unqualified attribute selector as the right-most part should result in a warning": function(){
            var result = CSSLint.verify("p div [type=text] { font-size: 10px; }", {"unqualified-attributes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Unqualified attribute selectors are known to be slow.", result.messages[0].message);
        },

        "Using an unqualified attribute selector in the middle should not result in a warning": function(){
            var result = CSSLint.verify("[type=text] .foo { font-size: 10px; } ", {"unqualified-attributes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using a qualified attribute selector should not result in a warning": function(){
            var result = CSSLint.verify("input[type=text]  { font-size: 10px; } ", {"unqualified-attributes": 1 });
            Assert.areEqual(0, result.messages.length);
        }
        
        
    }));

})();
