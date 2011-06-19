(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "width: 100%; Errors",

        "Using width: 100% should result in one warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; }", { "width-100": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Elements with a width of 100% may not appear as you expect inside of other elements.", result.messages[0].message);
        },

        "Using width: 100px should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100px; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and -moz-box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; -moz-box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and -webkit-box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; -webkit-box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width: 100% and -ms-box-sizing should not result in a warning": function(){
            var result = CSSLint.verify("h1 { width: 100%; -ms-box-sizing: content-box; }", { "width-100": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
