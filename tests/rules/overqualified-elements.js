(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;
    
    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Overqualified Elements Errors",
        
        "Using an ID with an element should result in one warning": function(){
            var result = CSSLint.verify("li#foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Element (li#foo) is overqualified, just use #foo without element name.", result.messages[0].message);
        },
        
        "Using a class with an element should result in one warning": function(){
            var result = CSSLint.verify("li.foo { float: left;}", { "overqualified-elements": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Element (li.foo) is overqualified, just use .foo without element name.", result.messages[0].message);
        }
        
    }));     

})();
