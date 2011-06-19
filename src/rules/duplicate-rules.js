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
            current = [],
            iStart, iEnd;

        parser.addListener("startrule", function(event){
            iStart = event.selectors[0].line;
        });

        parser.addListener("endrule", function(event){
            if (current.length > 0) {
                joined = current.join("; ");
                sorted = current.sort().join("; ");
                if (typeof ruleStack[sorted] === 'undefined') {
                    ruleStack[sorted] = {
                        rule: joined,
                        start: iStart,
                        end: iEnd
                    };
                }
                else {
                    reporter.warn("Rule {" + joined + "} - Lines " + iStart + " to " + iEnd + " - was already declared at line " + ruleStack[sorted].start + " to " + ruleStack[sorted].end + ".", iStart, 0, rule);
                }
            }

            current = [];
        });

        parser.addListener("property", function(event){
            var name = event.property,
                value = event.value;

            current.push(name + ': ' + value);
            iEnd = event.property.line;
        });
    }

});