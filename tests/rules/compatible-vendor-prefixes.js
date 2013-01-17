(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;
    
    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Compatible Vendor Prefix Warnings",

        "Using -webkit-border-radius should not warn to also include -moz-border-radius.": function(){
            var result = CSSLint.verify("h1 { -webkit-border-radius: 5px; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using -webkit-transition and -moz-transition should warn to also include -o-transition.": function() {
            var result = CSSLint.verify("h1 { -webkit-transition: height 20px 1s; -moz-transition: height 20px 1s; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -o-transition is compatible with -webkit-transition and -moz-transition and should be included as well.", result.messages[0].message);
            Assert.areEqual(6, result.messages[0].col);
            Assert.areEqual(1, result.messages[0].line);            
        },
        
        "Using -webkit-transform should warn to also include -moz-transform, -ms-transform, and -o-transform.": function() {
            var result = CSSLint.verify("div.box { -webkit-transform: translate(50px, 100px); }", { "compatible-vendor-prefixes": 3 });
            Assert.areEqual(3, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -moz-transform is compatible with -webkit-transform and should be included as well.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("The property -ms-transform is compatible with -webkit-transform and should be included as well.", result.messages[1].message);
            Assert.areEqual("warning", result.messages[2].type);
            Assert.areEqual("The property -o-transform is compatible with -webkit-transform and should be included as well.", result.messages[2].message);
        },
        
        "Using -webkit-transform inside of an @-webkit- block shouldn't cause a warning": function(){
            var result = CSSLint.verify("@-webkit-keyframes spin {0%{ -webkit-transform: rotateX(-10deg) rotateY(0deg); } 100%{ -webkit-transform: rotateX(-10deg) rotateY(-360deg); } }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using all compatible vendor prefixes for animation should be allowed with no warnings.": function(){
            var result = CSSLint.verify(".next:focus { -moz-animation: 'diagonal-slide' 5s 10; -webkit-animation: 'diagonal-slide' 5s 10; -ms-animation: 'diagonal-slide' 5s 10; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using box-shadow with no vendor prefixes should be allowed with no warnings.": function(){
            var result = CSSLint.verify("h1 { box-shadow: 5px 5px 5px #ccc; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(0, result.messages.length);
        }
                
    }));     

})();
