(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Property-Value Pair Rule Errors",

        "Duplicate property count should result in a warning": function () {
            var result = CSSLint.verify(".foo { color: #f00; } .bar { color: #f00; }", {"duplicate-property-count": 1});
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property count:\n\n2,color", result.messages[0].message);
        }
    }));

})();
