(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Unique Headings Errors",

        "Defining two rules for h1 should result in two warnings": function(){
            var result = CSSLint.verify("h1 { color: red;} h1 {color: blue;}", { "unique-headings": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h1) has already been defined.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("You have 2 h1s defined in this stylesheet.", result.messages[1].message);
        },

        "Defining two rules for h1 and h2 should result in one warning": function(){
            var result = CSSLint.verify("h1 { color: red;} h1 {color: blue;} h2 { color: red;} h2 {color: blue;}", { "unique-headings": 1 });
            Assert.areEqual(3, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Heading (h1) has already been defined.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("Heading (h2) has already been defined.", result.messages[1].message);
            Assert.areEqual("warning", result.messages[2].type);
            Assert.areEqual("You have 2 h1s, 2 h2s defined in this stylesheet.", result.messages[2].message);
        },

        "Defining one rule for h1 should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;}", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Defining a rule for h1 and h1:hover should not result in a warning": function(){
            var result = CSSLint.verify("h1 { color: red;} h1:hover { color: blue; }", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Defining multiple rules that contain h1 should not result in a warning": function(){
            var result = CSSLint.verify("h2 a, h2 a:active, h2 a:hover, h2 a:visited, h2 a:link { color: red;}", { "unique-headings": 1 });
            Assert.areEqual(0, result.messages.length);        
        }

    }));

})();
