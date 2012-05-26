/*
 * Rule: Avoid new-line characters in selectors.
 */

CSSLint.addRule({

    //rule information
    id: "selector-newline",
    name: "Disallow new-line characters in selectors",
    desc: "New-line characters in selectors are usually a forgotten comma and not a descendant combinator.",
    browsers: "All",

    //initialization
    init: function(parser, reporter) {
        var rule = this;

        parser.addListener("startrule", function(event) {
            var i, len, selector, p, pLen, part, previousLine, currentLine,
                selectors = event.selectors;

            for (i = 0, len = selectors.length; i < len; i++) {
                selector = selectors[i];
                for (p = 0, pLen = selector.parts.length; p < pLen; p++) {
                    part = selector.parts[p];
                    currentLine = part.line;
                    if (currentLine === previousLine) {
                        reporter.report("newline character found in selector (forgot a comma?)", currentLine, selectors[i].parts[0].col, rule);
                    }
                    previousLine = currentLine;
                }
            }
        });
    }
});
