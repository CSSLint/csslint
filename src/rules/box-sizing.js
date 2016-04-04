/*
 * Rule: box-sizing doesn't work in IE6 and IE7.
 */

CSSLint.addRule({

    // rule information
    id: "box-sizing",
    name: "Disallow use of box-sizing",
    desc: "The box-sizing properties isn't supported in IE6 and IE7.",
    url: "https://github.com/CSSLint/csslint/wiki/Disallow-box-sizing",
    browsers: "IE6, IE7",
    tags: ["Compatibility"],

    // initialization
    init: function(parser, reporter) {
        "use strict";
        var rule = this;

        parser.addListener("property", function(event) {
            var name = event.property.text.toLowerCase();

            if (name === "box-sizing") {
                reporter.report("The box-sizing property isn't supported in IE6 and IE7.", event.line, event.col, rule);
            }
        });
    }

});
