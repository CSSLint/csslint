/*
 * Rule: Rules should be unique
 */
CSSLint.addRule({

    //rule information
    id: "duplicate-rules",
    name: "Duplicate Rules",
    desc: "Rules should be declared only once.",
    browsers: "All",

    //initialization
    init: function(parser, reporter){
        var rule = this,
            sorted,
            joined,
            ruleStack =  {},
            current = [];

        parser.addListener("endrule", function(event){
            if (current.length > 0) {
                joined = current.join("; ");
                sorted = current.sort().join("; ");
                if (typeof ruleStack[sorted] === 'undefined') {
                    ruleStack[sorted] = joined;
                }
                else {
                    reporter.rollupWarn("Rule (" + joined + ") was declared multiple times.", rule);
                }
            }

            current = [];
        });

        parser.addListener("property", function(event){
            var name = event.property,
                value = event.value;

            current.push(name + ': ' + value);
        });
    }

});