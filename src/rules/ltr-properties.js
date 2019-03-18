/*
 * Rule: Detects properties for LTR text styling the require equivalent RTL styling.
 */
CSSLint.addRule({

    //rule information
    id: "ltr-properties",
    name: "LTR properties",
    desc: "Detects properties for LTR text styling the require equivalent RTL styling.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var properties = {
            "border-left": 1,
            "border-right": 1,
            "border-top-right-radius": 1,
            "border-top-left-radius": 1,
            "border-bottom-right-radius": 1,
            "border-bottom-left-radius": 1,
            "padding-left": 1,
            "padding-right": 1,
            "margin-left": 1,
            "margin-right": 1,
            "text-align": 1,
            background: 1,
            "background-position": 1,
            left: 1,
            right: 1
        },
        potentialProperties = {
            float: {
                left: 1,
                right: 1,
            },
            clear: {
                left: 1,
                right: 1,
            },
        },
        potentialMultipleValueProperties = {
            padding: 1,
            margin: 1,
            border: 1,
            "border-radius": 1,
        };

        parser.addListener("property", function(event){
            var rule = this,
                name    = event.property.toString().toLowerCase(),
                value   = event.value.toString(),
                line    = event.line,
                col     = event.col;

            // These properties always affect RTL.
            if (properties[name]){
                reporter.report("Using " + name + " could require an equivalent rule for RTL styling.", line, col, rule);
            }
            // These properties could affect RTL, if they have four values.
            else if (potentialMultipleValueProperties[name] && event.value.parts.length === 4){
                reporter.report("Using " + name + " in this way could require an equivalent rule for RTL styling.", line, col, rule);
            }
            // These properties could affect RTL, if they have certain values.
            else if(potentialProperties[name]) {
                var property = potentialProperties[name];
                if(property[value]) {
                    reporter.report("Using " + name + " in this way could require an equivalent rule for RTL styling.", line, col, rule);
                }
            }
        });
    }
});
