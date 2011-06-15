(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;
    
    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "width: 100%; Errors",
        
        "Using width: 100% should result in one warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; }", { "width-100": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Elements with a width of 100% may not appear as you expect inside of other elements.", result.messages[0].message);
        },
        
        "Using width: 100px should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100px; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        }      
    }));     

})();
