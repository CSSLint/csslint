(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;
    
    YUITest.TestRunner.add(new YUITest.TestCase({
    
        name: "Compatible Vendor Prefix Warnings",

        "Using -webkit-border-radius should warn to also include -moz-border-radius.": function(){
            var result = CSSLint.verify("h1 { -webkit-border-radius: 5px; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -moz-border-radius is compatible with -webkit-border-radius and should be included as well.", result.messages[0].message);
            Assert.areEqual(6, result.messages[0].col);
            Assert.areEqual(1, result.messages[0].line);
        },
        
        "Using -webkit-transition and -moz-transition should warn to also include -o-transition and -ms-transition.": function(){
            var result = CSSLint.verify("h1 { -webkit-transition: height 20px 1s; -moz-transition: height 20px 1s; }", { "compatible-vendor-prefixes": 1 });
            Assert.areEqual(2, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -o-transition is compatible with -webkit-transition and -moz-transition and should be included as well.", result.messages[0].message);
            Assert.areEqual(6, result.messages[0].col);
            Assert.areEqual(1, result.messages[0].line);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("The property -ms-transition is compatible with -webkit-transition and -moz-transition and should be included as well.", result.messages[1].message);
            Assert.areEqual(6, result.messages[1].col);
            Assert.areEqual(1, result.messages[1].line);
            
        },
        
        "Using -webkit-transform should warn to also include -moz-transform, -ms-transform, and -o-transform.": function(){
            var result = CSSLint.verify("div.box { -webkit-transform: translate(50px, 100px); }", { "compatible-vendor-prefixes": 3 });
            Assert.areEqual(3, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("The property -moz-transform is compatible with -webkit-transform and should be included as well.", result.messages[0].message);
            Assert.areEqual("warning", result.messages[1].type);
            Assert.areEqual("The property -ms-transform is compatible with -webkit-transform and should be included as well.", result.messages[1].message);
            Assert.areEqual("warning", result.messages[2].type);
            Assert.areEqual("The property -o-transform is compatible with -webkit-transform and should be included as well.", result.messages[2].message);
        },
        
        "Using all compatible vendor prefixes for animation should be allowed with no warnings.": function(){
            var result = CSSLint.verify(".next:focus { -moz-animation: 'diagonal-slide' 5s 10; -webkit-animation: 'diagonal-slide' 5s 10; -ms-animation: 'diagonal-slide' 5s 10; }", { "compatible-vendor-prefixes": 0 });
            Assert.areEqual(0, result.messages.length);
        },
        
        "Using box-shadow with no vendor prefixes should be allowed with no warnings.": function(){
            var result = CSSLint.verify("h1 { box-shadow: 5px 5px 5px #ccc; }", { "compatible-vendor-prefixes": 0 });
            Assert.areEqual(0, result.messages.length);
        }
                
    }));     

})();
