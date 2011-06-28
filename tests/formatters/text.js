(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Text formatter",
        
        "File with no problems should say so": function(){
            var result = { messages: [], stats: [] };
            Assert.areEqual("\n\ncsslint: No errors in FILE.", CSSLint.format(result, "FILE", "text"));
        },

        "File with problems should list them": function(){
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] }
                ], stats: [] },
                error1 = "\n1: warning at line 1, col 1\nBOGUS\nALSO BOGUS",
                error2 = "\n2: error at line 2, col 1\nBOGUS\nALSO BOGUS",
                expected = "\n\ncsslint: There are 2 problems in FILE.\nFILE" + error1 + "\nFILE" + error2;
            Assert.areEqual(expected, CSSLint.format(result, "FILE", "text"));
        }

    }));

})();
