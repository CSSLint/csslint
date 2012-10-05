(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
    
/*
background: -moz-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); 
background: -webkit-gradient(linear, left top, left bottom, color-stop(,#1e5799), color-stop(,#2989d8), color-stop(,#207cca), color-stop(10,#7db9e8)); 
background: -webkit-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 );
background: -o-linear-gradient(top, #1e5799 ,#2989d8 ,#207cca ,#7db9e8 );

*/

        name: "Gradients Rule Errors",

        "Only using Mozilla gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -moz-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Webkit (Safari 5+, Chrome), Old Webkit (Safari 4+, Chrome), Opera 11.1+.", result.messages[0].message);
        },

        "Only using Opera gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -o-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Firefox 3.6+, Webkit (Safari 5+, Chrome), Old Webkit (Safari 4+, Chrome).", result.messages[0].message);
        },

        "Only using WebKit gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -webkit-linear-gradient(top, #1e5799 , #2989d8 , #207cca , #7db9e8 ); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Firefox 3.6+, Old Webkit (Safari 4+, Chrome), Opera 11.1+.", result.messages[0].message);
        },

        "Only using old WebKit gradients should result in a warning": function(){
            var result = CSSLint.verify(".foo { background: -webkit-gradient(linear, left top, left bottom, color-stop(10%,#1e5799), color-stop(20%,#2989d8), color-stop(30%,#207cca), color-stop(100%,#7db9e8)); }", {"gradients": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("Missing vendor-prefixed CSS gradients for Firefox 3.6+, Webkit (Safari 5+, Chrome), Opera 11.1+.", result.messages[0].message);
        },

        "Using all vendor-prefixed gradients should not result in a warning": function(){
            var result = CSSLint.verify("div.box {\n    background: -moz-linear-gradient(top,  #1e5799 0%, #7db9e8 100%);\n    background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#1e5799), color-   stop(100%,#7db9e8));\n    background: -webkit-linear-gradient(top,  #1e5799 0%,#7db9e8 100%);\n    background: -o-linear-gradient(top,  #1e5799 0%,#7db9e8 100%);\n}", { "gradients": 1 });
            Assert.areEqual(0, result.messages.length);
        }
    }));

})();
