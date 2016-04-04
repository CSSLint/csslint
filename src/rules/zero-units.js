/*
 * Rule: You don't need to specify units when a value is 0.
 */

CSSLint.addRule({

    // rule information
    id: "zero-units",
    name: "Disallow units for 0 values",
    desc: "You don't need to specify units when a value is 0.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-units-for-zero-values",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // count how many times "float" is used
        parser.addListener("property", function(event) {
            var parts = event.value.parts,
                i = 0,
                len = parts.length;

            while (i < len) {
                if ((parts[i].units || parts[i].type === "percentage") && parts[i].value === 0 && parts[i].type !== "time") {
                    reporter.report("Values of 0 shouldn't have units specified.", parts[i].line, parts[i].col, rule);
                }
                i++;
            }

        });

    }

});
