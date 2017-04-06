/*
 * Rule: Warn when there are 500 or more rules in a stylesheet
 */

CSSLint.addRule({

    // rule information
    id: "rules-max",
    name: "Warn when 500+ rules are present",
    desc: "Will warn when the rule count in a stylesheet crosses the 500 threshold.",
    browsers: "IE",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this, ruleCount = 0, MAX_RULES = 499;

        parser.addListener("startrule", function() {
            ruleCount += 1;
        });

        parser.addListener("endstylesheet", function() {
            if (ruleCount > MAX_RULES) {
                reporter.report("There are too many rules (" + ruleCount + ") in the stylesheet.", 0, 0, rule);
            }
        });
    }

});
