(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Vendor Prefix Errors",

        "Using -moz-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 {\n    -moz-border-radius: 5px; \n}", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-moz-border-radius'.", result.messages[0].message);
            Assert.areEqual(2, result.messages[0].line);
            Assert.areEqual(5, result.messages[0].col);
        },

        "Using -webkit-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { -webkit-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-webkit-border-radius'.", result.messages[0].message);
        },

        "Using -o-border-radius without border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { -o-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-radius' to go along with '-o-border-radius'.", result.messages[0].message);
        },

        "Using -moz-border-radius after  border-radius should result in one warning": function(){
            var result = CSSLint.verify("h1 { \nborder-radius: 5px; \n    -moz-border-radius: 5px; }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Standard property 'border-radius' should come after vendor-prefixed property '-moz-border-radius'.", result.messages[0].message);
            Assert.areEqual(3, result.messages[0].line);
            Assert.areEqual(5, result.messages[0].col);

        },

        "Using -webkit-border-bottom-left-radius with border-bottom-left-radius should not result in a warning.": function(){
            var result = CSSLint.verify("h1 { -webkit-border-bottom-left-radius: 4px; border-bottom-left-radius: 4px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using -moz-border-radius-bottomleft should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-border-radius-bottomleft: 5px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'border-bottom-left-radius' to go along with '-moz-border-radius-bottomleft'.", result.messages[0].message);
        },

        "Using -moz-box-shadow should result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-box-shadow: 5px;  }", { "vendor-prefix": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing standard property 'box-shadow' to go along with '-moz-box-shadow'.", result.messages[0].message);
        },

        "Using -moz-user-select should not result in a warning.": function(){
            var result = CSSLint.verify("h1 {  -moz-user-select:none;  }", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using @font-face should not result in an error (#90)": function(){
            var result = CSSLint.verify("@font-face { src:url('../fonts/UniversBold.otf');font-family:Univers;advancedAntiAliasing: true;}", { "vendor-prefix": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
