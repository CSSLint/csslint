/*
 * Rule: Avoid new-line characters in selectors.
 */

CSSLint.addRule({

    // rule information
    id: "selector-newline",
    name: "Disallow new-line characters in selectors",
    desc: "New-line characters in selectors are usually a forgotten comma and not a descendant combinator.",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        function startRule(event) {
            var i, len, selector, p, n, pLen, part, part2, type, currentLine, nextLine,
                selectors = event.selectors;

            for (i = 0, len = selectors.length; i < len; i++) {
                selector = selectors[i];
                for (p = 0, pLen = selector.parts.length; p < pLen; p++) {
                    for (n = p + 1; n < pLen; n++) {
                        part = selector.parts[p];
                        part2 = selector.parts[n];
                        type = part.type;
                        currentLine = part.line;
                        nextLine = part2.line;

                        if (type === "descendant" && nextLine > currentLine) {
                            reporter.report("newline character found in selector (forgot a comma?)", currentLine, selectors[i].parts[0].col, rule);
                        }
                    }
                }

            }
        }

        parser.addListener("startrule", startRule);

    }
});
