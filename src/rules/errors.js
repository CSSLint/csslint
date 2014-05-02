/*
 * Rule: There should be no syntax errors. (Duh.)
 */

CSSLint.addRule({

    //rule information
    id: "errors",
    name: "Parsing Errors",
    desc: "This rule looks for recoverable syntax errors.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        "use strict";
        var rule = this;

        parser.addListener("error", function(event){
            reporter.error(event.message, event.line, event.col, rule);
        });

    }

});
