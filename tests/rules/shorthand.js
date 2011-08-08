(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Shorthand Rule Errors",

        "All padding properties should result in a warning": function(){
            var result = CSSLint.verify(".foo{padding-top: 0px; padding-left: 3px; padding-right: 25px; padding-bottom: 10px;}", {"shorthand": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The properties padding-top, padding-bottom, padding-left, padding-right can be replaced by padding.", result.messages[0].message);
        },

        "All margin properties should result in a warning": function(){
            var result = CSSLint.verify(".foo{margin-top: 0px; margin-left: 3px; margin-right: 25px; margin-bottom: 10px;}", {"shorthand": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The properties margin-top, margin-bottom, margin-left, margin-right can be replaced by margin.", result.messages[0].message);
        },

        "padding-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo{ padding-left: 8px;} ", {"shorthand": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "margin-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo{ margin-top: 8px;} ", {"shorthand": 1 });
            Assert.areEqual(0, result.messages.length);
        }
				
    }));

})();
