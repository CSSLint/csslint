(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Zero Units Errors",

        "Using 0px should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0px; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0em should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0em; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0% should result in one warning": function(){
            var result = CSSLint.verify("h1 { left: 0%; }", { "zero-units": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Values of 0 shouldn't have units specified.", result.messages[0].message);
        },

        "Using 0 should not result in a warning": function(){
            var result = CSSLint.verify("h1 { left: 0; }", { "zero-units": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using 0s for animation-duration should not result in a warning": function(){
            var result = CSSLint.verify("h1 { animation-duration: 0s; }", { "zero-units": 1 });
            Assert.areEqual(0, result.messages.length);
        }
        
        
    }));

})();
