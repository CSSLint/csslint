/*
 * Rule: Disallow duplicate background-images (using url).
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "duplicate-background-images",
    name: "Disallow duplicate background images",
    desc: "Every background-image should be unique. Use a common class for e.g. sprites.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            stack = {};

        parser.addListener("property", function(event){
            var name = event.property.text,
                value = event.value,
                i, len;

            if (name.match(/background/i)) {
                for (i=0, len=value.parts.length; i < len; i++) {
                    if (value.parts[i].type == 'uri') {
                        if (typeof stack[value.parts[i].uri] === 'undefined') {
                            stack[value.parts[i].uri] = event;
                        }
                        else {
                            reporter.report("Background image '" + value.parts[i].uri + "' was used multiple times, first declared at line " + stack[value.parts[i].uri].line + ", col " + stack[value.parts[i].uri].col + ".", event.line, event.col, rule);
                        }
                    }
                }
            }
        });
    }
});