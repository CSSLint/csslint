/*
 * Rule: Avoid too many @font-face declarations in the same stylesheet.
 */

CSSLint.addRule({

    // rule information
    id: "font-faces",
    name: "Don't use too many web fonts",
    desc: "Too many different web fonts in the same stylesheet.",
    url: "https://github.com/CSSLint/csslint/wiki/Don%27t-use-too-many-web-fonts",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            count = 0;


        parser.addListener("startfontface", function(event) {
            if (!reporter.isIgnored(event.line)) {
                count++;
            }
        });

        parser.addListener("endstylesheet", function() {
            if (count > 5) {
                reporter.rollupWarn("Too many @font-face declarations (" + count + ").", rule);
            }
        });
    }

});
