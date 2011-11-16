(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Duplicate Background-URL Rule Errors",

        "duplicate background-image should result in a warning": function(){
            var result = CSSLint.verify(".foo { background-image: url('mega-sprite.png'); } .foofoo { background-image: url('fancy-sprite.png'); } .bar { background-image: url(\"mega-sprite.png\"); } .foobar { background: white url(mega-sprite.png); }", {"duplicate-background-images": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Background image 'mega-sprite.png' was used multiple times, first declared at line 1, col 8.", result.messages[0].message);
        },

        "duplicate background with url should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: url(mega-sprite.png) repeat-x; } .foofoo { background-image: url('fancy-sprite.png'); } .bar { background: white url(\"mega-sprite.png\") no-repeat left top; } .foobar { background: white url('mega-sprite.png'); }", {"duplicate-background-images": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Background image 'mega-sprite.png' was used multiple times, first declared at line 1, col 8.", result.messages[0].message);
        }
    }));

})();
