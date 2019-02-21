(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Visited Styles Errors",

        "Visited links can only differ by color.": function(){
            var result = CSSLint.verify("a:visited { text-decoration: underline; }", { "visited-styles": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual(":visited and :link styles can only differ by color.", result.messages[0].message);
        },

    }));

})();
