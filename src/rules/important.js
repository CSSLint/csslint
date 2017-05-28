/*
 * Rule: Make sure !important is not overused, this could lead to specificity
 * war. Display a warning on !important declarations, an error if it's
 * used more at least 10 times.
 */

CSSLint.addRule({

    // rule information
    id: "important",
    name: "Disallow !important",
    desc: "Be careful when using !important declaration",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-%21important",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        // warn that important is used and increment the declaration counter
        parser.addListener("property", function(event) {
            if (!reporter.isIgnored(event.line)) {
                if (event.important === true) {
                    count++;
                    reporter.report("Use of !important", event.line, event.col, rule);
                }
            }
        });

        // if there are more than 10, show an error
        parser.addListener("endstylesheet", function() {
            reporter.stat("important", count);
            if (count >= 10) {
                reporter.rollupWarn("Too many !important declarations (" + count + "), try to use less than 10 to avoid specificity issues.", rule);
            }
        });
    }

});
