/*
 * Rule: Don't use universal selector because it's slow.
 */

CSSLint.addRule({

    // rule information
    id: "universal-selector",
    name: "Disallow universal selector",
    desc: "The universal selector (*) is known to be slow.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-universal-selector",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("startrule", function(event) {
            var selectors = event.selectors,
                selector,
                part,
                i;

            for (i=0; i < selectors.length; i++) {
                selector = selectors[i];

                part = selector.parts[selector.parts.length-1];
                if (part.elementName === "*") {
                    reporter.report(rule.desc, part.line, part.col, rule);
                }
            }
        });
    }

});
