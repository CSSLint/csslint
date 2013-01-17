/*
 * Rule: Put each selector in its own line.
 */

/*jslint plusplus:false*/
/*global CSSLint*/

CSSLint.addRule({

    //rule information
    id: "one-selector-per-line",
    name: "At most one selector per line",
    desc: "To increase readability, put each selector in its own line.",
    browsers: "All",

    //initialization
    init: function (parser, reporter) {
        var rule = this;

        parser.addListener("startrule", function (event) {
            var i, len, selectors, previousLine, currentLine;
            selectors = event.selectors;
            for (i = 0, len = selectors.length; i < len; i++) {
                currentLine = selectors[i].parts[0].line;
                if (currentLine === previousLine) {
                    reporter.report("multiple selectors in one line found", currentLine, selectors[i].parts[0].col, rule);
                }
                previousLine = currentLine;
            }
        });
    }
});