/*
 * Rule: Don't use width or height when using padding or border.
 */
CSSLint.addRule({

    // rule information
    id: "box-model",
    name: "Beware of broken box size",
    desc: "Don't use width or height when using padding or border.",
    url: "https://github.com/CSSLint/csslint/wiki/Beware-of-box-model-size",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            widthProperties = {
                border: 1,
                "border-left": 1,
                "border-right": 1,
                padding: 1,
                "padding-left": 1,
                "padding-right": 1
            },
            heightProperties = {
                border: 1,
                "border-bottom": 1,
                "border-top": 1,
                padding: 1,
                "padding-bottom": 1,
                "padding-top": 1
            },
            properties,
            boxSizing = false,
            selectors,
            universalBoxSizing = false,
            warnings = [];

        // the universal selector (*) applies to all elements,
        // so a box-sizing declared there makes the warnings unnecessary
        function hasUniversalSelector() {
            var i, part;

            for (i = 0; i < selectors.length; i++) {
                if (selectors[i].parts.length === 1) {
                    part = selectors[i].parts[0];
                    if (part.elementName === "*" && part.modifiers.length === 0) {
                        return true;
                    }
                }
            }
            return false;
        }

        function startRule(event) {
            properties = {};
            boxSizing = false;
            selectors = event.selectors;
        }

        function endRule() {
            var prop, value;

            if (!boxSizing) {
                if (properties.height) {
                    for (prop in heightProperties) {
                        if (heightProperties.hasOwnProperty(prop) && properties[prop]) {
                            value = properties[prop].value;
                            // special case for padding
                            if (!(prop === "padding" && value.parts.length === 2 && value.parts[0].value === 0)) {
                                warnings.push({ message: "Using height with " + prop + " can sometimes make elements larger than you expect.", line: properties[prop].line, col: properties[prop].col });
                            }
                        }
                    }
                }

                if (properties.width) {
                    for (prop in widthProperties) {
                        if (widthProperties.hasOwnProperty(prop) && properties[prop]) {
                            value = properties[prop].value;

                            if (!(prop === "padding" && value.parts.length === 2 && value.parts[1].value === 0)) {
                                warnings.push({ message: "Using width with " + prop + " can sometimes make elements larger than you expect.", line: properties[prop].line, col: properties[prop].col });
                            }
                        }
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
            var name = event.property.text.toLowerCase();

            if (heightProperties[name] || widthProperties[name]) {
                if (!/^0\S*$/.test(event.value) && !(name === "border" && event.value.toString() === "none")) {
                    properties[name] = {
                        line: event.property.line,
                        col: event.property.col,
                        value: event.value
                    };
                }
            } else {
                if (/^(width|height)/i.test(name) && /^(length|percentage)/.test(event.value.parts[0].type)) {
                    properties[name] = 1;
                } else if (name === "box-sizing") {
                    boxSizing = true;
                    if (selectors && hasUniversalSelector()) {
                        universalBoxSizing = true;
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

        parser.addListener("endstylesheet", function() {
            var i;

            if (universalBoxSizing) {
                return;
            }
            for (i = 0; i < warnings.length; i++) {
                reporter.report(warnings[i].message, warnings[i].line, warnings[i].col, rule);
            }
        });
    }

});
