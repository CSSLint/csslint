/*
 * Rule: Set color any time background-color is set
 *
 */

CSSLint.addRule({

    // rule information
    id: "background-color",
    name: "Set color any time background-color is set",
    desc: "Checks for a value for color whenever background-color is set",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            bgColorDef,
            colorDef;


        function startRule(event) {
            bgColorDef = false;
            rule.col = event.col;
            rule.line = event.line;
        }

        // event handler for end of rules
        function endRule() {
            if (bgColorDef) {
                if (!colorDef) {
                    reporter.report("Explicitly set color any time background color is used.", rule.line, rule.col, rule);
                } else if (bgColorDef.red === colorDef.red && bgColorDef.green === colorDef.green && bgColorDef.blue === colorDef.blue) {
                    reporter.report("Text color is the same as the background color.", rule.line, rule.col, rule);
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        // check for use of "background" with color, "background-color", and "color"
        parser.addListener("property", function(event) {
            var name = event.property.toString().toLowerCase(),
                parts = event.value.parts;

            // get the color values used
            function getColor() {
                var ndx = parts.length - 1,
                    color;

                // if value is type 'color', red, green, and blue are also set
                while (ndx > -1 && !color) {
                    if (parts[ndx].type === "color") {
                        color = { red:parts[ndx].red, blue:parts[ndx].blue, green:parts[ndx].green };
                    }
                    ndx -= 1;
                }

                return color;
            }

            if (name === "background-color") {
                bgColorDef = getColor();
            } else if (name === "background") {
                bgColorDef = getColor();
            } else if (name === "color") {
                colorDef = getColor();
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);

    }

});
