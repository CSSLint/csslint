(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Box Sizing Rule Errors",

        "Using box-sizing should result in a warning": function(){
            var result = CSSLint.verify(".foo { box-sizing: border-box; }", { "box-sizing": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The box-sizing property isn't supported in IE6 and IE7.", result.messages[0].message);
        },

        "No box-sizing should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 0; }", { "box-sizing": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
