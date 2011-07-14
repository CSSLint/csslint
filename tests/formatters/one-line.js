(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "One-line formatter",
        
        "File with no problems should say so": function(){
            var result = { messages: [], stats: [] };
            Assert.areEqual("FILE: Lint Free!", CSSLint.format(result, "FILE", "one-line"));
        },

        "File with problems should list them": function(){
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS WARNING', evidence: 'BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS ERROR', evidence: 'BOGUS', rule: [] }
                ], stats: [] },
                error1 = "FILE: line 1, col 1, BOGUS WARNING\n",
                error2 = "FILE: line 2, col 1, BOGUS ERROR\n",
                expected = error1 + error2,
                actual = CSSLint.format(result, "FILE", "one-line");
            Assert.areEqual(expected, actual);
        }

    }));

})();
