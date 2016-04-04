/*
 * Rule: IE6-9 supports up to 31 stylesheet import.
 * Reference:
 * http://blogs.msdn.com/b/ieinternals/archive/2011/05/14/internet-explorer-stylesheet-rule-selector-import-sheet-limit-maximum.aspx
 */

CSSLint.addRule({

    // rule information
    id: "import-ie-limit",
    name: "@import limit on IE6-IE9",
    desc: "IE6-9 supports up to 31 @import per stylesheet",
    browsers: "IE6, IE7, IE8, IE9",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            MAX_IMPORT_COUNT = 31,
            count = 0;

        function startPage() {
            count = 0;
        }

        parser.addListener("startpage", startPage);

        parser.addListener("import", function() {
            count++;
        });

        parser.addListener("endstylesheet", function() {
            if (count > MAX_IMPORT_COUNT) {
                reporter.rollupError(
                    "Too many @import rules (" + count + "). IE6-9 supports up to 31 import per stylesheet.",
                    rule
                );
            }
        });
    }

});
