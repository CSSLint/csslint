(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Box Model Rule Errors",

        "Using width and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with padding can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width:auto with padding should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: auto; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width:available with padding should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: available; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height:auto with padding should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: auto; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with padding-left can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when padding-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with padding-right can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when padding-right is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-to-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 10px 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with border can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width and border with box-sizing should not result in a warning": function(){
            var result = CSSLint.verify(".foo { box-sizing: border-box; width: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with border-left can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when border-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using width with border-right can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using width when border-right is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-top should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with padding can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-left-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding: 0 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-top should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with padding-top can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when padding-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with padding-bottom can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when padding-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with border can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height and border: none should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: none; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border: 0 should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-left should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-right should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-top should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with border-top can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when border-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Using height with border-bottom can sometimes make elements larger than you expect.", result.messages[0].message);
        },

        "Using height when border-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
