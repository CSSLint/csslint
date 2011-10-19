/*
 * Rule: outline: none or outline: 0 should only be used in a :focus rule
 *       and only if there are other properties in the same rule.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "outline-none",
    name: "Disallow outline: none",
    desc: "Use of outline: none or outline: 0 should be limited to :focus rules.",
    browsers: "All",
    tags: ["Accessibility"],

    //initialization
    init: function(parser, reporter){
        var rule = this,
            lastRule;

        function startRule(event){
            if (event.selectors){
                lastRule = {
                    line: event.line,
                    col: event.col,
                    selectors: event.selectors,
                    propCount: 0,
                    outline: false
                };
            } else {
                lastRule = null;
            }
        }
        
        function endRule(event){
            if (lastRule){
                if (lastRule.outline){
                    if (lastRule.selectors.toString().toLowerCase().indexOf(":focus") == -1){
                        reporter.report("Outlines should only be modified using :focus.", lastRule.line, lastRule.col, rule);
                    } else if (lastRule.propCount == 1) {
                        reporter.report("Outlines shouldn't be hidden unless other visual changes are made.", lastRule.line, lastRule.col, rule);                        
                    }
                }
            }
        }

        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
        parser.addListener("startpage", startRule);
        parser.addListener("startpagemargin", startRule);
        parser.addListener("startkeyframerule", startRule); 

        parser.addListener("property", function(event){
            var name = event.property.text.toLowerCase(),
                value = event.value;                
                
            if (lastRule){
                lastRule.propCount++;
                if (name == "outline" && (value == "none" || value == "0")){
                    lastRule.outline = true;
                }            
            }
            
        });
        
        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);
        parser.addListener("endpage", endRule);
        parser.addListener("endpagemargin", endRule);
        parser.addListener("endkeyframerule", endRule); 

    }

});