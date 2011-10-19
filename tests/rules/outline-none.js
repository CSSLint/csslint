(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Outline:none Errors",

        "Using outline: none should result in a warning": function(){
            var result = CSSLint.verify(".foo { outline: none; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines should only be modified using :focus.", result.messages[0].message);
        },

        "Using outline: 0 should result in a warning": function(){
            var result = CSSLint.verify(".foo { outline: 0; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines should only be modified using :focus.", result.messages[0].message);
        },
        
        "Using outline: none alone with :focus should result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: none; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines shouldn't be hidden unless other visual changes are made.", result.messages[0].message);
        },

        "Using outline: 0 alone with :focus should result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: 0; }", { "outline-none": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Outlines shouldn't be hidden unless other visual changes are made.", result.messages[0].message);
        },
        
        "Using outline: none with :focus and another property should not result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: none; border: 1px solid black; }", { "outline-none": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using outline: 0 with :focus and another property should not result in a warning": function(){
            var result = CSSLint.verify(".foo:focus { outline: 0; border: 1px solid black;}", { "outline-none": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
