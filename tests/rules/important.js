(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "!important; Errors",

        "!important declarations should result in a warning": function(){
            var result = CSSLint.verify("h1 { color:#fff !important; }", { "important": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Use of !important", result.messages[0].message);
        },

        "Using !important at least 10 times should result in an error": function(){
            var css = "h1 { color:#fff !important; } h2 { color:#fff !important; } h3 { color:#fff !important; } h4 { color:#fff !important; } h5 { color:#fff !important; } h6 { color:#fff !important; } p { color:#fff !important; } ul { color:#fff !important; } ol { color:#fff !important; } li { color:#fff !important; }";
            var result = CSSLint.verify(css, { "important": 1 });
            Assert.areEqual(11, result.messages.length);
            Assert.areEqual("warning", result.messages[10].type);
            Assert.areEqual("Too many !important declarations (10), try to use less than 10 to avoid specificity issues.", result.messages[10].message);
        }

    }));

})();
