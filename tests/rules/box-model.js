(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Box Model Rule Errors",

        "Using width and padding should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with padding.", result.messages[0].message);
        },

        "Using width when padding is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with padding-left.", result.messages[0].message);
        },

        "Using width when padding-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and padding-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; padding-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with padding-right.", result.messages[0].message);
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
            Assert.areEqual("Broken box model: using width with border.", result.messages[0].message);
        },
        
        "Using width and border-left should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with border-left.", result.messages[0].message);
        },

        "Using width when border-left is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-left: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using width and border-right should result in a warning": function(){
            var result = CSSLint.verify(".foo { width: 100px; border-right: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using width with border-right.", result.messages[0].message);
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
            Assert.areEqual("Broken box model: using height with padding.", result.messages[0].message);
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
            Assert.areEqual("Broken box model: using height with padding-top.", result.messages[0].message);
        },

        "Using height when padding-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and padding-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with padding-bottom.", result.messages[0].message);
        },

        "Using height when padding-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; padding-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with border.", result.messages[0].message);
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
            Assert.areEqual("Broken box model: using height with border-top.", result.messages[0].message);
        },

        "Using height when border-top is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-top: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height and border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 10px; }", { "box-model": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Broken box model: using height with border-bottom.", result.messages[0].message);
        },

        "Using height when border-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 0px; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using height when border-bottom is zero should not result in a warning": function(){
            var result = CSSLint.verify(".foo { height: 100px; border-bottom: 0; }", { "box-model": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();
