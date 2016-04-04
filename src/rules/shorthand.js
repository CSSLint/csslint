/*
 * Rule: Use shorthand properties where possible.
 *
 */

CSSLint.addRule({

    // rule information
    id: "shorthand",
    name: "Require shorthand properties",
    desc: "Use shorthand properties where possible.",
    url: "https://github.com/CSSLint/csslint/wiki/Require-shorthand-properties",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this,
            prop, i, len,
            propertiesToCheck = {},
            properties,
            mapping = {
                "margin": [
                    "margin-top",
                    "margin-bottom",
                    "margin-left",
                    "margin-right"
                ],
                "padding": [
                    "padding-top",
                    "padding-bottom",
                    "padding-left",
                    "padding-right"
                ]
            };

        // initialize propertiesToCheck
        for (prop in mapping) {
            if (mapping.hasOwnProperty(prop)) {
                for (i=0, len=mapping[prop].length; i < len; i++) {
                    propertiesToCheck[mapping[prop][i]] = prop;
                }
            }
        }

        function startRule() {
            properties = {};
        }

        // event handler for end of rules
        function endRule(event) {

            var prop, i, len, total;

            // check which properties this rule has
            for (prop in mapping) {
                if (mapping.hasOwnProperty(prop)) {
                    total=0;

                    for (i=0, len=mapping[prop].length; i < len; i++) {
                        total += properties[mapping[prop][i]] ? 1 : 0;
                    }

                    if (total === mapping[prop].length) {
                        reporter.report("The properties " + mapping[prop].join(", ") + " can be replaced by " + prop + ".", event.line, event.col, rule);
                    }
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);

        // check for use of "font-size"
        parser.addListener("property", function(event) {
            var name = event.property.toString().toLowerCase();

            if (propertiesToCheck[name]) {
                properties[name] = 1;
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);

    }

});
