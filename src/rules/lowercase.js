/*
 * Rule: properties and functions should be lowercase
 */

CSSLint.addRule({

    // rule information
    id: "lowercase",
    name: "Require lowercase properties and functions",
    desc: "All properties and functions should be lowercase",
    browsers: "All",

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("property", function(event) {
            var prop = event.property.text,
                func = /([a-z\-]+)\(/i.exec(event.value.text);

            if (prop !== prop.toLowerCase()) {
                reporter.report("Property is not lowercase.", event.line, event.col, rule);
            } else if (func) {
                if (func[1] !== func[1].toLowerCase()) {
                    reporter.report("Function is not lowercase.", event.line, event.col, rule);
                }
            }
        });
    }

});
