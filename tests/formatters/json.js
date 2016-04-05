(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "JSON formatter",

        "File with no problems should say so": function() {
            var result = {
                messages: [],
                stats: []
            };
            var expected = "{\"filename\":\"path/to/FILE\",\"messages\":[],\"stats\":[]}";
            var formatter = CSSLint.getFormatter("json");
            var actual = formatter.startFormat() +
                formatter.formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                }) +
                formatter.endFormat();
            Assert.areEqual(expected, actual);
        },

        "Should have no output when quiet option is specified and no errors": function() {
            var result = {
                messages: [],
                stats: []
            };
            var formatter = CSSLint.getFormatter("json");
            var actual = formatter.startFormat() +
                formatter.formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE",
                    quiet: "true"
                }) +
                formatter.endFormat();
            Assert.areEqual("", actual);
        },

        "Should have output when quiet option is specified and there are errors": function() {
            var result = {
                messages: [{
                    type: "warning",
                    line: 1,
                    col: 1,
                    message: "BOGUS",
                    evidence: "ALSO BOGUS",
                    rule: []
                }],
                stats: []
            };
            var expected = "{\"filename\":\"path/to/FILE\",\"messages\":[{\"type\":\"warning\",\"line\":1,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]}],\"stats\":[]}";
            var formatter = CSSLint.getFormatter("json");
            var actual = formatter.startFormat() +
                formatter.formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE",
                    quiet: "true"
                }) +
                formatter.endFormat();
            Assert.areEqual(expected, actual);
        },

        "File with problems should list them": function() {
            var result = {
                messages: [{
                    type: "warning",
                    line: 1,
                    col: 1,
                    message: "BOGUS",
                    evidence: "ALSO BOGUS",
                    rule: []
                }, {
                    type: "error",
                    line: 2,
                    col: 1,
                    message: "BOGUS",
                    evidence: "ALSO BOGUS",
                    rule: []
                }],
                stats: []
            };
            var expected = "{\"filename\":\"path/to/FILE\",\"messages\":[{\"type\":\"warning\",\"line\":1,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]},{\"type\":\"error\",\"line\":2,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]}],\"stats\":[]}";
            var formatter = CSSLint.getFormatter("json");
            var actual = formatter.startFormat() +
                formatter.formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                }) +
                formatter.endFormat();
            Assert.areEqual(expected, actual);
        },

        "Multiple files are handled properly": function() {
            var result = {
                messages: [{
                    type: "warning",
                    line: 1,
                    col: 1,
                    message: "BOGUS",
                    evidence: "ALSO BOGUS",
                    rule: []
                }],
                stats: []
            };
            var expected = "[{\"filename\":\"path/to/FILE\",\"messages\":[{\"type\":\"warning\",\"line\":1,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]}],\"stats\":[]},{\"filename\":\"path/to/FILE\",\"messages\":[{\"type\":\"warning\",\"line\":1,\"col\":1,\"message\":\"BOGUS\",\"evidence\":\"ALSO BOGUS\",\"rule\":[]}],\"stats\":[]}]";
            var formatter = CSSLint.getFormatter("json");
            var actual = formatter.startFormat() +
                formatter.formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                }) +
                formatter.formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                }) +
                formatter.endFormat();
            Assert.areEqual(expected, actual);
        }

    }));

})();
