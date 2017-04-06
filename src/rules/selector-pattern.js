/*
 * Rule: warn when the selector naming convention is not followed
 */

CSSLint.addRule({

    // rule information
    id: "selector-pattern",
    name: "Warn when the naming convention is not followed",
    desc: "Will warn when the selector naming convention is not followed",
    browsers: "All",

    // initialization
    init: function(parser, reporter, options) {
        "use strict";
        var rule = this,
            rxCamel = { "accept": /^[a-z]+([0-9]+|[A-Z][a-z]+)?/, "reject": /[\-\_]+/ },
            rxSnake = { "accept": /^[a-z][a-z0-9\_]+$/, "reject": /\-/ },
            rxDashs = { "accept": /^[a-z][a-z0-9\-]*$/, "reject": /\_/ },
            choice = options ? options["name-pattern"] : "bem",
            pattern;

        choice = (choice || "bem").toString().toLowerCase();
        switch (choice) {
            case "camelcase":
                pattern = rxCamel;
                break;
            case "snakecase":
                pattern = rxSnake;
                break;
            default:
                pattern = rxDashs;
                break;
        }

        parser.addListener("startrule", function(event) {
            var sel,
                pts,
                cls,
                bites;

            for (sel = 0; sel < event.selectors.length; sel += 1) {
                for (pts = 0; pts < event.selectors[sel].parts.length; pts += 1) {
                    if (event.selectors[sel].parts[pts].type === 8) {
                        bites = event.selectors[sel].parts[pts].text.split(/\#|\./);
                        for (cls = 0; cls < bites.length; cls += 1) {
                            if (bites[cls] && (!pattern.accept.test(bites[cls]) || pattern.reject.test(bites[cls]))) {
                                reporter.report("Selector naming convention (" + choice + ") not followed.", event.line, event.col, rule);
                            }
                        }
                    }
                }
            }
        });
    }

});
