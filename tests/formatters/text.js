(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Text formatter",
        
        "File with no problems should say so": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("text").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual("\n\ncsslint: No errors in path/to/FILE.", actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("text").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE", quiet: "true"});
            Assert.areEqual("", actual);
        },

        "File with problems should list them": function() {
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS', evidence: 'ALSO BOGUS', rule: [] }
                ], stats: [] },
                error1 = "\n1: warning at line 1, col 1\nBOGUS\nALSO BOGUS",
                error2 = "\n2: error at line 2, col 1\nBOGUS\nALSO BOGUS",
                expected = "\n\ncsslint: There are 2 problems in path/to/FILE.\n\nFILE" + error1 + "\n\nFILE" + error2,
                actual = CSSLint.getFormatter("text").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual(expected, actual);
        }

    }));

})();
