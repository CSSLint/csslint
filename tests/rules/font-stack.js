(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "font-stack Rule Errors",

        "omitting the generic family in a font-family declaration should result in a warning": function(){
            var result = CSSLint.verify(".foo{font-family: 'nop';}", {"font-stack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Did not find 'sans-serif', 'serif', or 'monospace' at the end of the font-family declaration.", result.messages[0].message);
        },
        "omitting the generic family in a font declaration should result in a warning": function(){
            result = CSSLint.verify(".foo{font: normal small-caps 120%/120% 'nop';}", {"font-stack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Did not find 'sans-serif', 'serif', or 'monospace' at the end of the font declaration.", result.messages[0].message);
        },

        "forgetting the dash in 'sans-serif' in a font-family declaration should result in a warning": function(){
            var result = CSSLint.verify(".foo{font-family: 'nop', sans serif;}", {"font-stack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Did not find 'sans-serif', 'serif', or 'monospace' at the end of the font-family declaration.", result.messages[0].message);
        },
        "forgetting the dash in 'sans-serif' in a font declaration should result in a warning": function(){
            result = CSSLint.verify(".foo{font: normal small-caps 120%/120% 'nop', sans serif;}", {"font-stack": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Did not find 'sans-serif', 'serif', or 'monospace' at the end of the font declaration.", result.messages[0].message);
        },

        "including the generic family in a font-family declaration should not result in a warning": function(){
            var result = CSSLint.verify(".foo{font-family: 'nop', sans-serif;}", {"font-stack": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        "including the generic family in a font declaration should not result in a warning": function(){
            result = CSSLint.verify(".foo{font: normal small-caps 120%/120% 'nop', sans-serif;}", {"font-stack": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));
})();
