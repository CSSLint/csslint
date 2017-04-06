/*
 * Rule: Check the color contrast any time background color and foreground color are set
 */

CSSLint.addRule({

    // rule information
    id: "color-contrast",
    name: "Check color contast",
    desc: "Checks color contrast when background color and foreground color are set",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            bgColorDef,
            colorDef;


        function startRule(event) {
            bgColorDef = false;
            colorDef = false;
            rule.col = event.col;
            rule.line = event.line;
        }

        // event handler for end of rule
        function endRule() {
            var BRIGHTNESS = 126,
                HUE = 501,
                brightness,
                hue;

            // calculate the brightness of a color
            function calcBrightness(cd) {
                var value = (299 * cd.red) + (587 * cd.green) + (114 * cd.blue);

                value = value / 1000;

                return value;
            }

            function calcHue(fg, bg) {
                var value = Math.abs(fg.red - bg.red) +
                            Math.abs(fg.green - bg.green) +
                            Math.abs(fg.blue - bg.blue);

                return value;
            }

            if (bgColorDef && colorDef) {
                // calculate the contrast
                brightness = Math.abs(calcBrightness(bgColorDef) - calcBrightness(colorDef));
                hue = calcHue(colorDef, bgColorDef);

                if (brightness < BRIGHTNESS || hue < HUE) {
                    reporter.report("There is not enough contrast between background and foreground colors.", rule.line, rule.col, rule);
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
                        color = { red: parts[ndx].red, green: parts[ndx].green, blue: parts[ndx].blue };
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
