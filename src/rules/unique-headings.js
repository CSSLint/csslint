/*
 * Rule: Headings (h1-h6) should be defined only once.
 */

CSSLint.addRule({

    // rule information
    id: "unique-headings",
    name: "Headings should only be defined once",
    desc: "Headings should be defined only once.",
    url: "https://github.com/CSSLint/csslint/wiki/Headings-should-only-be-defined-once",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        var headings = {
            h1: 0,
            h2: 0,
            h3: 0,
            h4: 0,
            h5: 0,
            h6: 0
        };

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                pseudo,
                i, j;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];
                part = selector.parts[selector.parts.length-1];

                if (reporter.isIgnored(part.line)) {
                    continue;
                }

                if (part.elementName && /(h[1-6])/i.test(part.elementName.toString())) {

                    for (j=0; j < part.modifiers.length; j++) {
                        if (part.modifiers[j].type === "pseudo") {
                            pseudo = true;
                            break;
                        }
                    }

                    if (!pseudo) {
                        headings[RegExp.$1]++;
                        if (headings[RegExp.$1] > 1) {
                            reporter.report("Heading (" + part.elementName + ") has already been defined.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });

        parser.addListener("endstylesheet", function() {
            var prop,
                messages = [];

            for (prop in headings) {
                if (headings.hasOwnProperty(prop)) {
                    if (headings[prop] > 1) {
                        messages.push(headings[prop] + " " + prop + "s");
                    }
                }
            }

            if (messages.length) {
                reporter.rollupWarn("You have " + messages.join(", ") + " defined in this stylesheet.", rule);
            }
        });
    }

});
