(function(){
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "JSON formatter",

        "File with no problems should say so": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("json").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual("{\"messages\":[],\"stats\":[]}", actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = { messages: [], stats: [] },
                actual = CSSLint.getFormatter("json").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE", quiet: "true"});
            Assert.areEqual("", actual);
        },

        "Should have output when quiet option is specified and there are errors": function() {
            var result = { messages: [
                { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] },
                { type: "error", line: 2, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] }
            ], stats: [] },
                expected = "{\"messages\":[{\"type\":\"warning\",\"line\":1,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]},{\"type\":\"error\",\"line\":2,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]}],\"stats\":[]}",
                actual = CSSLint.getFormatter("json").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE", quiet: "true"});
            Assert.areEqual(expected, actual);
        },

        "File with problems should list them": function() {
            var result = { messages: [
                { type: "warning", line: 1, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] },
                { type: "error", line: 2, col: 1, message: "BOGUS", evidence: "ALSO BOGUS", rule: [] }
            ], stats: [] },
                expected = "{\"messages\":[{\"type\":\"warning\",\"line\":1,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]},{\"type\":\"error\",\"line\":2,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]}],\"stats\":[]}",
                actual = CSSLint.getFormatter("json").formatResults(result, "path/to/FILE", {fullPath: "/absolute/path/to/FILE"});
            Assert.areEqual(expected, actual);
        }

    }));

})();
