/*
 * Rule: Disallow duplicate background-images (using url).
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "duplicate-background-url",
    name: "Disallow duplicate background-url",
    desc: "Every background-image should be unique. Use a common class for e.g. sprites.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            stack = {};

        parser.addListener("property", function(event){
            var name = event.property.text,
                value = event.value.text,
                match;

            if (name.match(/background/i) && value.match(/url/i)) {
                match = /url\(("|')?(.*?)("|')?\)/.exec(value);
                if (typeof match[2] !== 'undefined') {
                    if (typeof stack[match[2]] === 'undefined') {
                        stack[match[2]] = event;
                    }
                    else {
                        reporter.rollupWarn("Background-Image (" + match[2] + ") was used multiple times, first declared at line " + stack[match[2]].line + ", col " + + stack[match[2]].col + ".", event.line, event.col, rule);
                    }
                }
            }
        });
    }
});