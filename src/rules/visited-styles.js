/*
 * Rule: Visited styles can only differ by color.
 */
/*global CSSLint*/
CSSLint.addRule({

    //rule information
    id: "visited-styles",
    name: "Visited Styles",
    desc: ":visited and :link styles can only differ by color.",
    browsers: "All",

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
                    outline: false,
                    visitedDiffers: false
                };
            } else {
                lastRule = null;
            }
        }
        
        function endRule(event){
            if (lastRule){
                if (lastRule.visitedDiffers){
                    if (lastRule.selectors.toString().toLowerCase().indexOf(":visited") != -1) {
                        reporter.report(":visited and :link styles can only differ by color.", lastRule.line, lastRule.col, rule);
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
            var name = event.property.text.toLowerCase();                
                
            if (lastRule){
                if (name !== "color"){
                    lastRule.visitedDiffers = true;
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
