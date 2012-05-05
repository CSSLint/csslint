(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "text-indent Rule Errors",

        "-100px text-indent should result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100px;}", {"text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", result.messages[0].message);
        },

        "-99px text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -99px;} ", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "-99em text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -99em;} ", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "-100px text-indent with LTR should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100px; direction: ltr; }", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
            result = CSSLint.verify(".foo{direction: ltr; text-indent: -100px; }", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "-100em text-indent with RTL should result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: -100em; direction: rtl; }", {"text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", result.messages[0].message);
        },

        "5px text-indent should not result in a warning": function(){
            var result = CSSLint.verify(".foo{text-indent: 5px;}", {"text-indent": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "This should cause a warning, not an error": function(){
            var result = CSSLint.verify(".top h1 a { background: url(../images/background/logo.png) no-repeat; display: block; height: 44px; position: relative; text-indent: -9999px; width: 250px; }", { "text-indent": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set direction for that item to ltr.", result.messages[0].message);
        }

    }));

})();
