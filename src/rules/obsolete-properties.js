/*
 * Rule: Properties should not be obsolete
 */

CSSLint.addRule({

    // rule information
    id: "obsolete-properties",
    name: "Disallow use of obsolete properties",
    desc: "Properties should not be obsolete.",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            // properties recognized by parser-lib that are non-standard or obsolete
            obsolete = [
                "appearance",
                "azimuth",
                "behavior",
                "binding",
                "drop-initial-after-adjust",
                "drop-initial-after-align",
                "drop-initial-before-adjust",
                "drop-initial-before-align",
                "drop-initial-size",
                "drop-initial-value",
                "fit",
                "fit-position",
                "grid-cell-stacking",
                "grid-column-align",
                "grid-column-sizing",
                "grid-column-span",
                "grid-columns",
                "grid-flow",
                "grid-layer",
                "grid-row-align",
                "grid-row-sizing",
                "grid-row-span",
                "grid-rows",
                "hyphenate-after",
                "hyphenate-before",
                "hyphenate-character",
                "hyphenate-lines",
                "hyphenate-resource",
                "ime-mode",
                "marquee-direction",
                "marquee-play-count",
                "marquee-speed",
                "marquee-style",
                "move-to",
                "nav-index",
                "overflow-style",
                "page-policy",
                "punctuation-trim",
                "rotation",
                "rotation-point",
                "ruby-overhang",
                "ruby-span",
                "target",
                "target-name",
                "target-new",
                "target-position",
                "text-outline",
                "text-wrap",
                "user-modify",
                "white-space-collapse"
            ];

        parser.addListener("property", function(event) {
            var name = event.property.toString().toLowerCase();

            if (obsolete.indexOf(name) > -1) {
                reporter.report("Non-standard or obsolete property '" + name + "'.", event.line, event.col, rule);
            }
        });
    }

});
