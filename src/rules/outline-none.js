/*
 * Rule: outline: none or outline: 0 should only be used in a :focus rule
 *       and only if there are other properties in the same rule.
 */

CSSLint.addRule({

    // rule information
    id: "outline-none",
    name: "Disallow outline: none",
    desc: "Use of outline: none | 0 | transparent should be limited to :focus rules and resulting elements should be visible.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-outline%3Anone",
    browsers: "All",
    tags: ["Accessibility"],

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            lastRule;

        function startRule(event) {
            if (event.selectors) {
                lastRule = {
                    line: event.line,
                    col: event.col,
                    selectors: event.selectors,
                    propCount: 0,
                    outline: false,
                    potentiallyInvisibleElement: false
                };
            } else {
                lastRule = null;
            }
        }

        function endRule() {
            if (lastRule) {
                if (lastRule.outline) {
                    if (lastRule.selectors.toString().toLowerCase().indexOf(":focus") === -1) {
                        reporter.report("Outlines should only be modified using :focus.", lastRule.line, lastRule.col, rule);
                    } else if (lastRule.propCount === 1 || lastRule.potentiallyInvisibleElement === true) {
                        reporter.report("Outlines shouldn't be hidden unless other visual changes are made.", lastRule.line, lastRule.col, rule);
                    }
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule);
        parser.addListener("startviewport", startRule);

        parser.addListener("property", function(event) {

            var name = event.property.text.toLowerCase(),
                valueString = event.value.toString().toLowerCase();

            if (lastRule) {
                lastRule.propCount++;

                if (valueString.indexOf("none") !== -1 || valueString.indexOf("0") !== -1 || valueString.indexOf("transparent") !== -1) {
                    if (name === "outline") {
                        lastRule.outline = true;
                    }
                    else {
                        // these properties must not be 0, none, or transparent when outline is already one of those values
                        if (name.indexOf("border") >= 0) {
                            lastRule.potentiallyInvisibleElement = true;
                        }
                    }
                }
            }

        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule);
        parser.addListener("endviewport", endRule);

    }

});
