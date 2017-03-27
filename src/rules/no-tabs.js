/*
 * Rule: Don't use tabs, use space
 *
 */

CSSLint.addRule({

    // rule information
    id: "no-tabs",
    name: "Disallow tabs",
    desc: "Checks for tab",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            sheet;

        parser.addListener("startstylesheet", function() {
            sheet = this._tokenStream._reader._input.split(/\n/);
        });

        parser.addListener("property", function(event) {
            if (/\t/.test(sheet[event.line - 1])) {
                reporter.report("The TAB character is not allowed.", event.line, event.col, rule);
            }
        });
    }

});
