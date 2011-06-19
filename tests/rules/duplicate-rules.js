(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Rules Errors",

        "Defining a rules twice for different selectors should result in one warning": function(){
            var result = CSSLint.verify("#id.class { color: red;} \n\n\n#otherid { color: red;}", { "duplicate-rules": 1 });
            Assert.areEqual(1, result.messages.length);

            var result = CSSLint.verify(".class {float:left; \ncolor: red;} \n\n* {color: red; \n\nfloat:left;}", { "duplicate-rules": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule {color: red; float: left} - Lines 4 to 6 - was already declared at line 1 to 2.", result.messages[0].message);
        },

         "Defining one rule for a selector should not result in a warning": function(){
            var result = CSSLint.verify("#test { color: red;}", { "duplicate-selectors": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));
})();
