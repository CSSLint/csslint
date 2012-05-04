(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "underscore-property-hack Rule Errors",

        "a property with an underscore prefix should result in a warning": function(){
            var result = CSSLint.verify(".foo{_width: 100px;}", {"underscore-property-hack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Property with underscore prefix found.", result.messages[0].message);
        },

        "a property without an underscore prefix should not result in a warning": function(){
            var result = CSSLint.verify(".foo{width: 100px;}", {"underscore-property-hack": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
