(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Selectors Errors",

        "Defining two rules for the same selector should result in one warning": function(){
            var result = CSSLint.verify("#id.class { color: red;} #id.class {color: blue;}", { "duplicate-selectors": 1 });
            Assert.areEqual(1, result.messages.length);

            var result = CSSLint.verify("#id { color: red;} #id {color: blue;}", { "duplicate-selectors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Selectors should be used only once, #id was used 2 times.", result.messages[0].message);
        },

         "Defining one rule for a selector should not result in a warning": function(){
            var result = CSSLint.verify("#test { color: red;}", { "duplicate-selectors": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
