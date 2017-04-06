/*
 * Rule: Set color to a visible value
 *
 */

CSSLint.addRule({

    // rule information
    id: "transparent-color",
    name: "Named value 'transparent' used for color",
    desc: "Checks for a value for color that is transparent",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        // check for use of "transparent" as a value for "color"
        parser.addListener("property", function(event) {
            var name = event.property.toString().toLowerCase(),
                parts = event.value.parts,
                ndx = parts.length - 1;

            if (name === "color") {
                while (ndx > -1) {
                    if (parts[ndx].type === "identifier" && parts[ndx].value === "transparent") {
                        reporter.report("Color cannot be 'transparent'.", event.line, event.col, rule);
                        break;
                    }
                    ndx -= 1;
                }
            }
        });
    }

});
