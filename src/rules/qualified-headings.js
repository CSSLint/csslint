/*
 * Rule: Headings (h1-h6) should not be qualified (namespaced).
 */

CSSLint.addRule({

    // rule information
    id: "qualified-headings",
    name: "Disallow qualified headings",
    desc: "Headings should not be qualified (namespaced).",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-qualified-headings",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                i, j;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                for (j=0; j < selector.parts.length; j++) {
                    part = selector.parts[j];
                    if (part.type === parser.SELECTOR_PART_TYPE) {
                        if (part.elementName && /h[1-6]/.test(part.elementName.toString()) && j > 0) {
                            reporter.report("Heading (" + part.elementName + ") should not be qualified.", part.line, part.col, rule);
                        }
                    }
                }
            }
        });
    }

});
