(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Fallback Colors Rule Errors",

        "Using only a named color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { color: red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only a hex color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgb() should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { color: rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgba() should result in a warning": function(){
            var result = CSSLint.verify(".rgba { color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede RGBA color.", result.messages[0].message);
        },
        
        "Using only hsl() should result in a warning": function(){
            var result = CSSLint.verify(".hsl { color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSL color.", result.messages[0].message);
        },

        "Using only hsla() should result in a warning": function(){
            var result = CSSLint.verify(".hsla { color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSLA color.", result.messages[0].message);
        },

        "Using rgba() with a fallback should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { color: #fff; color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using hsl() with a fallback should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { color: #fff; color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { color: #fff; color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { color: rgba(0, 0, 0, 0.5); color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede RGBA color.", result.messages[0].message);
        },
        
        "Using hsl() with fallback color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { color: hsl(0, 0%, 0%); color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSL color.", result.messages[0].message);
        },

        "Using hsla() with fallback color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { color: hsla(0, 0%, 0%, 0.5); color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback color (hex or RGB) should precede HSLA color.", result.messages[0].message);
        },
        

        "Using only a named background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { background-color: red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only a hex background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgb() background-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { background-color: rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using only rgba() background-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { background-color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede RGBA background-color.", result.messages[0].message);
        },
        
        "Using only hsl() background-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { background-color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSL background-color.", result.messages[0].message);
        },

        "Using only hsla() background-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { background-color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSLA background-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback background-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { background-color: #fff; background-color: rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using hsl() with a fallback background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { background-color: #fff; background-color: hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback background-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { background-color: #fff; background-color: hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback background-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { background-color: rgba(0, 0, 0, 0.5); background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede RGBA background-color.", result.messages[0].message);
        },
        
        "Using hsl() with fallback background-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { background-color: hsl(0, 0%, 0%); background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSL background-color.", result.messages[0].message);
        },

        "Using hsla() with fallback background-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { background-color: hsla(0, 0%, 0%, 0.5); background-color: #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback background-color (hex or RGB) should precede HSLA background-color.", result.messages[0].message);
        }


        



    }));

})();
