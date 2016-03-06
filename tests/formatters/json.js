(function() {
    "use strict";
    var Assert = YUITest.Assert;

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "JSON formatter",

        "File with no problems should return empty string": function() {
            var result = {
                    messages: [],
                    stats: []
                },
                actual = CSSLint.getFormatter("json").formatResults(result, "path/to/FILE", {
                    fullPath: "/absolute/path/to/FILE"
                });
            Assert.areEqual("", actual);
        },

        "Files with problems should list them": function() {
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

            /*jshint -W108 */
            var expected = '[{"filename":"path/to/FILE","results":{"messages":[{"type":"warning","line":1,"col":1,"message":"BOGUS","evidence":"ALSO BOGUS","rule":[]},{"type":"error","line":2,"col":1,"message":"BOGUS","evidence":"ALSO BOGUS","rule":[]}],"stats":[]}}]';

            var formatter = CSSLint.getFormatter("json");

            var actual = formatter.startFormat() + formatter.formatResults(result, "path/to/FILE", {
                fullPath: "/absolute/path/to/FILE"
            }) + formatter.endFormat();

            Assert.areEqual(expected, actual);
        }

    }));

})();
