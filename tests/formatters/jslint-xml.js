(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "JSLint XML formatter",
        
        "File with no problems should say so": function(){
            var result = { messages: [], stats: [] },
                expected = "<?xml version='1.0' encoding='utf-8'?>\n<jslint>\n</jslint>";
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "jslint-xml"));
        },

        "File with problems should list them": function(){
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] }
                ], stats: [] },
                file = "\n  <file name='FILE'>",
                error1 = "\n    <issue line='1' char='1' reason='BOGUS' evidence='ALSO BOGUS'/>",
                error2 = "\n    <issue line='2' char='1' reason='BOGUS' evidence='ALSO BOGUS'/>",
                expected = "<?xml version='1.0' encoding='utf-8'?>\n<jslint>" + file + error1 + error2 + "\n  </file>\n</jslint>";
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "jslint-xml"));
        }

    }));

})();
