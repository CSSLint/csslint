/*
 * Rule: Style rules without any properties defined should be removed.
 */

CSSLint.addRule({

    // rule information
    id: "empty-rules",
    name: "Disallow empty rules",
    desc: "Rules without any properties specified should be removed.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-empty-rules",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        parser.addListener("startrule", function() {
            count=0;
        });

        parser.addListener("property", function() {
            count++;
        });

        parser.addListener("endrule", function(event) {
            var selectors = event.selectors;

            if (count === 0) {
                reporter.report("Rule is empty.", selectors[0].line, selectors[0].col, rule);
            }
        });
    }

});
