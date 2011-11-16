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
                value = event.value,
                i;

            if (name.match(/background/i)) {
                for (i in value.parts) {
                    if (value.parts[i].type == 'uri') {
                        if (typeof stack[value.parts[i].uri] === 'undefined') {
                            stack[value.parts[i].uri] = event;
                        }
                        else {
                            reporter.report("Background-Image (" + value.parts[i].uri + ") was used multiple times, first declared at line " + stack[value.parts[i].uri].line + ", col " + + stack[value.parts[i].uri].col + ".", event.line, event.col, rule);
                        }
                    }
                }
            }
        });
    }
});