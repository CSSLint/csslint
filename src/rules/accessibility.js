/*
 * Rule: Check the accessibility for known issues
 *
 * This rule covers most common accessibility mistakes - color, size, positioning,
 * hidden content, and limited interactions (e.g., pointer vs keyboard vs touch).
 * An example stylesheet with these problems is below.
 *
 *  .inaccessible-color {
 *      background-color: #fff;
 *      color: #ffe;
 *  }
 *  .inaccessible-size {
 *      font-size: 3px;
 *      height: 0;
 *      width: 0;
 *  }
 *  .inaccessible-positioning {
 *      left: 200%;
 *      position: absolute;
 *      top: 200%;
 *  }
 *  .inaccessible-content {
 *      content: "You will never see this";
 *      display: none;
 *      overflow: hidden;
 *      visibility: hidden;
 *  }
 *  .inaccessible-focus:focus {
 *      outline: none;
 *  }
 *  .inaccessible-hover:hover,
 *  .inaccessible-hover:focus {
 *      font-weight: bold;
 *      outline: none;
 *  }
 *
 * The other potential issue is overriding a user's stylesheet, which is commonly
 * done with the use of the "!important" indicator. Use of the !important keyword
 * causes general specificity issues not limited to accessibility, so it has been
 * kept in its own rule, "important".
 */

CSSLint.addRule({

    // rule information
    id: "accessibility",
    name: "Check accessibility issues",
    desc: "Checks common accessibility issues such as color contrast and inaccessible content",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            isfontface = false,
            iskeyframes = false,
            ispage = false,
            ispagemargin = false,
            ismedia = false;

        // we can skip evaluation if the rule is for paged media,
        // animation, or a specific font
        function skipEval() {
            return isfontface || iskeyframes || ispage || ispagemargin;
        }

        // sets up the rule object
        function startRule(event) {
            var selNdx = event.selectors.length - 1,
                prtNdx,
                modNdx,
                selObj,
                prtObj,
                modObj;

            // initialize the rule object
            rule.bgColor = false;
            rule.fgColor = false;
            rule.col = event.col;
            rule.line = event.line;
            rule.outline = false;
            rule.propCount = 0;
            rule.pseudos = {
                active: false,
                after: false,
                before: false,
                focus: false,
                hover: false
            };
            rule.selectors = event.selectors;

            while (selNdx > -1) {
                selObj = event.selectors[selNdx];
                prtObj = selObj.parts;
                prtNdx = prtObj ? prtObj.length - 1 : -1;
                while (prtNdx > -1) {
                    modObj = prtObj[prtNdx].modifiers;
                    modNdx = modObj ? modObj.length - 1 : -1;
                    while (modNdx > -1) {
                        switch (modObj[modNdx].text.toLowerCase()) {
                            case ":active":
                                rule.pseudos.active = true;
                                break;
                            case ":after":
                                rule.pseudos.after = true;
                                break;
                            case ":before":
                                rule.pseudos.before = true;
                                break;
                            case ":focus":
                                rule.pseudos.focus = true;
                                break;
                            case ":hover":
                                rule.pseudos.hover = true;
                                break;
                        }
                        modNdx -= 1;
                    }
                    prtNdx -= 1;
                }
                selNdx -= 1;
            }
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

            // calculate the hue difference in color
            function calcHue(fg, bg) {
                var value = Math.abs(fg.red - bg.red) +
                            Math.abs(fg.green - bg.green) +
                            Math.abs(fg.blue - bg.blue);

                return value;
            }

            // if this is not a rule type we should skip, do a final evaluation
            if (!skipEval()) {
                // check for :focus and :active when :hover is used
                if (rule.pseudos.hover && (!rule.pseudos.focus || !rule.pseudos.active)) {
                    reporter.report("Use of :hover without :active and :focus poses accessibility issues.", rule.line, rule.col, rule);
                }

                // check to make sure color is defined with background and that contrast is high enough
                if (rule.bgColor) {
                    if (!rule.fgColor) {
                        reporter.report("Explicitly set color any time background color is used.", rule.line, rule.col, rule);
                    } else {
                        // calculate the contrast
                        brightness = Math.abs(calcBrightness(rule.bgColor) - calcBrightness(rule.fgColor));
                        hue = calcHue(rule.fgColor, rule.bgColor);

                        if (brightness < BRIGHTNESS || hue < HUE) {
                            reporter.report("There is not enough contrast between background and foreground colors.", rule.line, rule.col, rule);
                        }
                    }
                }

                // check to make sure outline is not the only property modified
                if (rule.outline && rule.propCount === 1) {
                    reporter.report("Outline should not be hidden without other visual changes.", rule.line, rule.col, rule);
                }
            }
        }

        // set up listeners
        parser.addListener("startfontface", function() {
            isfontface = true;
            startRule();
        });
        parser.addListener("startkeyframes", function() {
            iskeyframes = true;
        });
        parser.addListener("startpage", function() {
            ispage = true;
        });
        parser.addListener("startpagemargin", function() {
            ispagemargin = true;
        });
        parser.addListener("startmedia", function() {
            ismedia = true;
        });
        parser.addListener("startrule", startRule);

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

            // if this is not a rule type we should skip, do a final evaluation
            if (!skipEval()) {
                // increment the property count
                rule.propCount += 1;

                switch (name) {
                    case "background-color":
                        // check for specification of color and contrast
                        rule.bgColor = getColor();
                        break;
                    case "background":
                        // check for specification of color and contrast
                        rule.bgColor = getColor();
                        break;
                    case "color":
                        // check for specification of background-color and contrast
                        // check to make sure color is not transparent
                        rule.fgColor = getColor();
                        break;
                    case "content":
                        reporter.report("Content specified in a stylesheet is not available to assistive technology.", event.line, event.col, rule);
                        break;
                    case "display":
                        // display none removes content from AT
                        if (event.value.text === "none") {
                            reporter.report("Hidden content is not accessible.", event.line, event.col, rule);
                        }
                        break;
                    case "font-size":
                    case "margin":
                    case "padding":
                        // check to make sure relative size is used
                        if (/p(c|t|x)|mm|q|cm|in/i.test(event.value.text)) {
                            reporter.report("Absolute lengths are not accessible.", event.line, event.col, rule);
                        }
                        break;
                    case "height":
                        if (event.value.parts[0].value === 0 && !rule.pseudos.after && !rule.pseudos.before) {
                            reporter.report("Hidden content is not accessible.", event.line, event.col, rule);
                        }
                        break;
                    case "outline":
                        if (event.value.toString() === "none" || event.value.toString() === "0") {
                            rule.outline = true;
                        }
                        break;
                    case "overflow":
                        if (event.value.text === "hidden") {
                            reporter.report("Hidden content is not accessible.", event.line, event.col, rule);
                        }
                        break;
                    case "position":
                        if (event.value.text === "absolute") {
                            reporter.report("Discoverability of absolutely positioned content may problematic.", event.line, event.col, rule);
                        }
                        break;
                    case "visibility":
                        if (event.value.text === "hidden") {
                            reporter.report("Hidden content is not accessible.", event.line, event.col, rule);
                        }
                        break;
                    case "width":
                        if (event.value.parts[0].value === 0 && !rule.pseudos.after && !rule.pseudos.before) {
                            reporter.report("Hidden content is not accessible.", event.line, event.col, rule);
                        }
                        break;
                }
            }
        });

        parser.addListener("endfontface", function() {
            isfontface = false;
        });
        parser.addListener("endkeyframes", function() {
            iskeyframes = false;
        });
        parser.addListener("endpage", function() {
            ispage = false;
        });
        parser.addListener("endpagemargin", function() {
            ispagemargin = false;
        });
        parser.addListener("endmedia", function() {
            ismedia = false;
        });
        parser.addListener("endrule", endRule);
    }

});
