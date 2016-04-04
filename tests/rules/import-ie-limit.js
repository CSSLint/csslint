(function() {
    "use strict";
    var Assert = YUITest.Assert,
        IMPORT_STATEMENT = "@import url('foo.css');",
        MAX_IMPORT_LIMIT = 31,
        withinLimitCss = "",
        exceedLimitCss = "",
        greatlyExceedLimitCss = "",
        i;

    // Build CSS strings to be used in tests
    withinLimitCss = IMPORT_STATEMENT;

    for (i = 0; i < MAX_IMPORT_LIMIT + 1; i++) {
        exceedLimitCss += IMPORT_STATEMENT;
    }

    for (i = 0; i < MAX_IMPORT_LIMIT + 100; i++) {
        greatlyExceedLimitCss += IMPORT_STATEMENT;
    }

    YUITest.TestRunner.add(new YUITest.TestCase({

        name: "Import IE Limit Rule Error",

        "Using @import <= 31 times should not result in error": function() {

            var result = CSSLint.verify(withinLimitCss, { "import-ie-limit": 1 });
            Assert.areEqual(0, result.messages.length);
        },

        "Using @import > 31 times should result in error": function() {
            var result = CSSLint.verify(exceedLimitCss, { "import-ie-limit": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
            Assert.areEqual("Too many @import rules (32). IE6-9 supports up to 31 import per stylesheet.", result.messages[0].message);
        },

        "Using @import > 31 times repeatedly should result in a single error": function() {
            var result = CSSLint.verify(greatlyExceedLimitCss, { "import-ie-limit": 1 });
            Assert.areEqual(1, result.messages.length);
            Assert.areEqual("error", result.messages[0].type);
            Assert.areEqual("Too many @import rules (131). IE6-9 supports up to 31 import per stylesheet.", result.messages[0].message);
        }
    }));

})();
