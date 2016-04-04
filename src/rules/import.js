/*
 * Rule: Don't use @import, use <link> instead.
 */

CSSLint.addRule({

    // rule information
    id: "import",
    name: "Disallow @import",
    desc: "Don't use @import, use <link> instead.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-%40import",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("import", function(event) {
            reporter.report("@import prevents parallel downloads, use <link> instead.", event.line, event.col, rule);
        });

    }

});
