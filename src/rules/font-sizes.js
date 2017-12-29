/*
 * Rule: You shouldn't need more than 9 font-size declarations.
 */

CSSLint.addRule({

    // rule information
    id: "font-sizes",
    name: "Disallow too many font sizes",
    desc: "Checks the number of font-size declarations.",
    url: "https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-font-size-declarations",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;

        // check for use of "font-size"
        parser.addListener("property", function(event) {
            if (!reporter.isIgnored(event.property.line)) {
                if (event.property.toString() === "font-size") {
                    count++;
                }
            }
        });

        // report the results
        parser.addListener("endstylesheet", function() {
            reporter.stat("font-sizes", count);
            if (count >= 10) {
                reporter.rollupWarn("Too many font-size declarations (" + count + "), abstraction needed.", rule);
            }
        });
    }

});
