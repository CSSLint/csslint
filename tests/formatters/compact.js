(function(){

    /*global YUITest, CSSLint*/
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Compact formatter",

        "File with no problems should say so": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual("path/to/FILE: Lint Free!", actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE", quiet: "true"});
            Assert.areEqual("", actual);
        },

        "File with problems should list them": function() {
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS WARNING', evidence: 'BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS ERROR', evidence: 'BOGUS', rule: [] }
                ], stats: [] },
                error1 = "FILE: line 1, col 1, BOGUS WARNING\n",
                error2 = "FILE: line 2, col 1, BOGUS ERROR\n",
                expected = error1 + error2,
                actual = CSSLint.getFormatter("compact").formatResults(result, "FILE");
            Assert.areEqual(expected, actual);
        },

        "Should output relative file paths": function() {
            var result = { messages: [ 
                     { type: 'warning', line: 1, col: 1, message: 'BOGUS WARNING', evidence: 'BOGUS', rule: [] },
                     { type: 'error', line: 2, col: 1, message: 'BOGUS ERROR', evidence: 'BOGUS', rule: [] }
                ], stats: [] },
                error1 = "path/to/FILE: line 1, col 1, BOGUS WARNING\n",
                error2 = "path/to/FILE: line 2, col 1, BOGUS ERROR\n",
                expected = error1 + error2,
                actual = CSSLint.getFormatter("compact").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual(expected, actual);
        }

    }));

})();
