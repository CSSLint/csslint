(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert, i, j, css1 = "", css2 = "", css3 = "", css4 = "";

    // create css1, which has only 4095 rules and 4095 selectors
    for (i = 1; i <= 4095; i++) {
        css1 += ".selector" + i + " { background:red; } ";
    }
    
    // create css2, which has 4096 rules and 4096 selectors
    for (i = 1; i <= 4096; i++) {
        css2 += ".selector" + i + " { background:red; } ";
    }
    
    // create css3, which has 1024 and but only 4095 selectors
    for (i = 0; i <= 1022; i++) {
        j = i * 4;
        css3 += ".selector" + (j+1) + ", .selector" + (j+2) + ", .selector" + (j+3) + ", .selector" + (j+4) + " { background:red; } ";
    }
    css3 += ".selector4093 { background:red; }.selector4094, .selector4095 { background:red; } ";

    // create css4, which has 1024 rules and 4096 selectors
    for (i = 0; i <= 1023; i++) {
        j = i * 4;
        css4 += ".selector" + (j+1) + ", .selector" + (j+2) + ", .selector" + (j+3) + ", .selector" + (j+4) + " { background:red; } ";
    }
    
    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Selector Max Errors Approaching",

        "Using 4095 or fewer single-selector rules should not result in a warning": function(){
            var result = CSSLint.verify(css1, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4095 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4096 or more single-selector rules should result in a warning": function(){
            var result = CSSLint.verify(css2, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4096 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4095 or fewer selectors should not result in a warning": function(){
            var result = CSSLint.verify(css3, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4095 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using 4096 or more selectors should result in a warning": function(){
            var result = CSSLint.verify(css4, { "selector-max-approaching": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("warning", result.messages[0].type);
            Assert.areEqual("You have 4096 selectors. Internet Explorer supports a maximum of 4095 selectors per stylesheet. Consider refactoring.", result.messages[0].message);
        },
        
        "Using fewer than 3800 selectors should not result in a warning": function() {
            var result = CSSLint.verify(".selector1 { background: red; }", { "selector-max-approaching": 1 });
            Assert.areEqual(0, result.messages.length);
        }

    }));

})();