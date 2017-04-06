/*
 * Rule: Filter is experimental and may have unexpected behavior
 */

CSSLint.addRule({

    // rule information
    id: "no-filter",
    name: "Disallow filter",
    desc: "Filter does not have a stable specification and should not be used",
    url: "https://github.com/hrobertking/csslint/wiki/Disallow-filter",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // report a use of 'filter'
        parser.addListener("property", function(event) {
            if (event.property.toString().toLowerCase() === "filter") {
                reporter.report("The filter property is not allowed", event.line, event.col, rule);
            }
        });

    }

});
