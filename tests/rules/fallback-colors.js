(function(){
    "use strict";
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
        },

        // border color tests

        "Using only a named border should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede RGBA border.", result.messages[0].message);
        },

        "Using only hsl() border should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSL border.", result.messages[0].message);
        },

        "Using only hsla() border should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSLA border.", result.messages[0].message);
        },

        "Using rgba() with a fallback border should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border: 1px solid #fff; border: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border: 1px solid #fff; border: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border: 1px solid #fff; border: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border: 1px solid rgba(0, 0, 0, 0.5); border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede RGBA border.", result.messages[0].message);
        },

        "Using hsl() with fallback border afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border: 1px solid hsl(0, 0%, 0%); border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSL border.", result.messages[0].message);
        },

        "Using hsla() with fallback border afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border: 1px solid hsla(0, 0%, 0%, 0.5); border: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border (hex or RGB) should precede HSLA border.", result.messages[0].message);
        },

        // border-top color tests

        "Using only a named border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-top should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-top: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-top should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede RGBA border-top.", result.messages[0].message);
        },

        "Using only hsl() border-top should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSL border-top.", result.messages[0].message);
        },

        "Using only hsla() border-top should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSLA border-top.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-top should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top: 1px solid #fff; border-top: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top: 1px solid #fff; border-top: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-top should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top: 1px solid #fff; border-top: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-top afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top: 1px solid rgba(0, 0, 0, 0.5); border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede RGBA border-top.", result.messages[0].message);
        },

        "Using hsl() with fallback border-top afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top: 1px solid hsl(0, 0%, 0%); border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSL border-top.", result.messages[0].message);
        },

        "Using hsla() with fallback border-top afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top: 1px solid hsla(0, 0%, 0%, 0.5); border-top: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top (hex or RGB) should precede HSLA border-top.", result.messages[0].message);
        },

        // border-right color tests

        "Using only a named border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-right should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-right: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-right should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede RGBA border-right.", result.messages[0].message);
        },

        "Using only hsl() border-right should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSL border-right.", result.messages[0].message);
        },

        "Using only hsla() border-right should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSLA border-right.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-right should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right: 1px solid #fff; border-right: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right: 1px solid #fff; border-right: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-right should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right: 1px solid #fff; border-right: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-right afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right: 1px solid rgba(0, 0, 0, 0.5); border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede RGBA border-right.", result.messages[0].message);
        },

        "Using hsl() with fallback border-right afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right: 1px solid hsl(0, 0%, 0%); border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSL border-right.", result.messages[0].message);
        },

        "Using hsla() with fallback border-right afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right: 1px solid hsla(0, 0%, 0%, 0.5); border-right: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right (hex or RGB) should precede HSLA border-right.", result.messages[0].message);
        },

        // border-bottom color tests

        "Using only a named border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-bottom: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede RGBA border-bottom.", result.messages[0].message);
        },

        "Using only hsl() border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSL border-bottom.", result.messages[0].message);
        },

        "Using only hsla() border-bottom should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSLA border-bottom.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom: 1px solid #fff; border-bottom: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom: 1px solid #fff; border-bottom: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-bottom should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom: 1px solid #fff; border-bottom: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-bottom afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom: 1px solid rgba(0, 0, 0, 0.5); border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede RGBA border-bottom.", result.messages[0].message);
        },

        "Using hsl() with fallback border-bottom afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom: 1px solid hsl(0, 0%, 0%); border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSL border-bottom.", result.messages[0].message);
        },

        "Using hsla() with fallback border-bottom afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom: 1px solid hsla(0, 0%, 0%, 0.5); border-bottom: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom (hex or RGB) should precede HSLA border-bottom.", result.messages[0].message);
        },

        // border-left color tests

        "Using only a named border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-left should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-left: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-left should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede RGBA border-left.", result.messages[0].message);
        },

        "Using only hsl() border-left should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSL border-left.", result.messages[0].message);
        },

        "Using only hsla() border-left should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSLA border-left.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-left should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left: 1px solid #fff; border-left: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left: 1px solid #fff; border-left: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-left should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left: 1px solid #fff; border-left: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-left afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left: 1px solid rgba(0, 0, 0, 0.5); border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede RGBA border-left.", result.messages[0].message);
        },

        "Using hsl() with fallback border-left afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left: 1px solid hsl(0, 0%, 0%); border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSL border-left.", result.messages[0].message);
        },

        "Using hsla() with fallback border-left afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left: 1px solid hsla(0, 0%, 0%, 0.5); border-left: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left (hex or RGB) should precede HSLA border-left.", result.messages[0].message);
        },

        // border-color color tests

        "Using only a named border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede RGBA border-color.", result.messages[0].message);
        },

        "Using only hsl() border-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSL border-color.", result.messages[0].message);
        },

        "Using only hsla() border-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSLA border-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-color: 1px solid #fff; border-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-color: 1px solid #fff; border-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-color: 1px solid #fff; border-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-color: 1px solid rgba(0, 0, 0, 0.5); border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede RGBA border-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-color: 1px solid hsl(0, 0%, 0%); border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSL border-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-color: 1px solid hsla(0, 0%, 0%, 0.5); border-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-color (hex or RGB) should precede HSLA border-color.", result.messages[0].message);
        },

        // border-top-color color tests

        "Using only a named border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-top-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-top-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede RGBA border-top-color.", result.messages[0].message);
        },

        "Using only hsl() border-top-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSL border-top-color.", result.messages[0].message);
        },

        "Using only hsla() border-top-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSLA border-top-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top-color: 1px solid #fff; border-top-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top-color: 1px solid #fff; border-top-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-top-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top-color: 1px solid #fff; border-top-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-top-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-top-color: 1px solid rgba(0, 0, 0, 0.5); border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede RGBA border-top-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-top-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-top-color: 1px solid hsl(0, 0%, 0%); border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSL border-top-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-top-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-top-color: 1px solid hsla(0, 0%, 0%, 0.5); border-top-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-top-color (hex or RGB) should precede HSLA border-top-color.", result.messages[0].message);
        },

        // border-right-color color tests

        "Using only a named border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-right-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-right-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede RGBA border-right-color.", result.messages[0].message);
        },

        "Using only hsl() border-right-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSL border-right-color.", result.messages[0].message);
        },

        "Using only hsla() border-right-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSLA border-right-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right-color: 1px solid #fff; border-right-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right-color: 1px solid #fff; border-right-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-right-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right-color: 1px solid #fff; border-right-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-right-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-right-color: 1px solid rgba(0, 0, 0, 0.5); border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede RGBA border-right-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-right-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-right-color: 1px solid hsl(0, 0%, 0%); border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSL border-right-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-right-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-right-color: 1px solid hsla(0, 0%, 0%, 0.5); border-right-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-right-color (hex or RGB) should precede HSLA border-right-color.", result.messages[0].message);
        },

        // border-bottom-color color tests

        "Using only a named border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-bottom-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-bottom-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede RGBA border-bottom-color.", result.messages[0].message);
        },

        "Using only hsl() border-bottom-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSL border-bottom-color.", result.messages[0].message);
        },

        "Using only hsla() border-bottom-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSLA border-bottom-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom-color: 1px solid #fff; border-bottom-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom-color: 1px solid #fff; border-bottom-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-bottom-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom-color: 1px solid #fff; border-bottom-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-bottom-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-bottom-color: 1px solid rgba(0, 0, 0, 0.5); border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede RGBA border-bottom-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-bottom-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-bottom-color: 1px solid hsl(0, 0%, 0%); border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSL border-bottom-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-bottom-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-bottom-color: 1px solid hsla(0, 0%, 0%, 0.5); border-bottom-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-bottom-color (hex or RGB) should precede HSLA border-bottom-color.", result.messages[0].message);
        },

        // border-left-color color tests

        "Using only a named border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left-color: 1px solid red; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only a hex border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hex { border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgb() border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgb { border-left-color: 1px solid rgb(0, 0, 0); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using only rgba() border-left-color should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede RGBA border-left-color.", result.messages[0].message);
        },

        "Using only hsl() border-left-color should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSL border-left-color.", result.messages[0].message);
        },

        "Using only hsla() border-left-color should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSLA border-left-color.", result.messages[0].message);
        },

        "Using rgba() with a fallback border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left-color: 1px solid #fff; border-left-color: 1px solid rgba(0, 0, 0, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsl() with a fallback border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left-color: 1px solid #fff; border-left-color: 1px solid hsl(0, 0%, 0%); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using hsla() with a fallback border-left-color should not result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left-color: 1px solid #fff; border-left-color: 1px solid hsla(0, 0%, 0%, 0.5); }", { "fallback-colors": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using rgba() with fallback border-left-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".rgba { border-left-color: 1px solid rgba(0, 0, 0, 0.5); border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede RGBA border-left-color.", result.messages[0].message);
        },

        "Using hsl() with fallback border-left-color afterwards should result in a warning": function(){
            var result = CSSLint.verify(".hsl { border-left-color: 1px solid hsl(0, 0%, 0%); border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSL border-left-color.", result.messages[0].message);
        },

        "Using hsla() with fallback border-left-color afterwards  should result in a warning": function(){
            var result = CSSLint.verify(".hsla { border-left-color: 1px solid hsla(0, 0%, 0%, 0.5); border-left-color: 1px solid #fff; }", { "fallback-colors": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Fallback border-left-color (hex or RGB) should precede HSLA border-left-color.", result.messages[0].message);
        }

    }));

})();
