(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Rules Errors",

        "Defining a rules twice for different selectors should result in one warning": function(){
            var result = CSSLint.verify("#id.class { color: red;} #otherid { color: red;}", { "duplicate-rules": 1 });
            Assert.areEqual(1, result.messages.length);

            var result = CSSLint.verify(".class {float:left; color: red;} * {color: red; float:left;}", { "duplicate-rules": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Rule (color: red; float: left) was declared multiple times.", result.messages[0].message);
        },

         "Defining one rule for a selector should not result in a warning": function(){
            var result = CSSLint.verify("#test { color: red;}", { "duplicate-selectors": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
