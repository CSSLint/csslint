(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "text-indent Rule Errors",

        "-100px text-indent should result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100px;}", {"text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set text-direction for that item to ltr.", result.messages[0].message);
        },

        "-98px text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -98px;} ", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "5px text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: 5px;}", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
