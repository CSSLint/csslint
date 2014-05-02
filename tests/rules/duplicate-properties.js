(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Property Rule Errors",

        "Duplicate properties back-to-back should not result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; float: right }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Duplicate properties in @font-face back-to-back should not result in a warning": function(){
            var result = CSSLint.verify("@font-face { src: url(foo.svg); src: url(foo1.svg) }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Duplicate properties in @page back-to-back should not result in a warning": function(){
            var result = CSSLint.verify("@page :left { margin: 5px; margin: 4px; }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Duplicate properties not back-to-back should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; margin: 0; float: right }", { "duplicate-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property 'float' found.", result.messages[0].message);
        },

        "Duplicate properties not back-to-back with same values should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; margin: 0; float: left }", { "duplicate-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property 'float' found.", result.messages[0].message);
        },

        "Duplicate properties back-to-back with same values should result in a warning": function(){
            var result = CSSLint.verify(".foo { float: left; float: left }", { "duplicate-properties": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Duplicate property 'float' found.", result.messages[0].message);
        },

        "Duplicate properties in @keyframe rules should not result in a warning": function(){
            var result = CSSLint.verify("@-webkit-keyframes slide_up {  from {  bottom:-91px; } to {  bottom:0; } }", { "duplicate-properties": 1 });
            Assert.areEqual(0, result.messages.length);
        }


    }));

})();
