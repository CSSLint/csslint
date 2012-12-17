(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Bulletproof @font-face syntax tests",

        "Using the official bulletproof syntax should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Skipping the hashtag with the svgFontName and having content after .eot? should also pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?#iefix') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "The minified version of the code should pass": function(){
            var result = CSSLint.verify("@font-face{font-family:'MyFontFamily';" +
                                            "src:url('myfont-webfont.eot?#iefix') format('embedded-opentype')," +
                                            "url('myfont-webfont.woff') format('woff')," +
                                            "url('myfont-webfont.ttf') format('truetype')," +
                                            "url('myfont-webfont.svg#svgFontName') format('svg')}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Skipping one of the font types should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },


        "Supplying the fonts in a different order should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot?#iefix') format('embedded-opentype')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using mixed double and single quotes should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url(\"myfont-webfont.eot?#iefix\") format(\"embedded-opentype\")," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url(\"myfont-webfont.woff\") format('woff')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Having only one font declaration with the question mark should pass": function(){
            var result = CSSLint.verify("@font-face{src:url('myfont-webfont.eot?') format('embedded-opentype');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "When we aren't inside an @font-face declaration the src property should not be checked": function(){
            var result = CSSLint.verify(".foo .bar{src:url('baz.png');}", { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using the advanced syntax with two src properties should pass": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('webfont.eot'); /* IE9 Compat Modes */" +
                                        "src: url('myfont-webfont.eot?') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Leaving off the question mark should fail": function(){
            var result = CSSLint.verify("@font-face { font-family: 'MyFontFamily';" +
                                        "src: url('myfont-webfont.eot') format('embedded-opentype')," +
                                             "url('myfont-webfont.woff') format('woff')," +
                                             "url('myfont-webfont.ttf')  format('truetype')," +
                                             "url('myfont-webfont.svg#svgFontName') format('svg');}",
                                        { "bulletproof-font-face": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("@font-face declaration doesn't follow the fontspring bulletproof syntax.", result.messages[0].message);
        }

    }));
})();
