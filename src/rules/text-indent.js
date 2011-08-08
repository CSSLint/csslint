/*
 * Rule: Don't use text-indent for image replacement if you need to support rtl. 
 * 
 */
/*
 * Should we be checking for rtl/ltr?
 */
//Commented out due to lack of tests
CSSLint.addRule({

    //rule information
    id: "text-indent",
    name: "Text Indent",
    desc: "Checks for text indent less than -99px",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this,
            textIndent = false;
            
            
        function startRule(event){
            textIndent = false;
        }
        
        //event handler for end of rules
        function endRule(event){
            if (textIndent){
                reporter.warn("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set text-direction for that item to ltr.", name.line, name.col, rule);
            }
        }        
        
        parser.addListener("startrule", startRule);
        parser.addListener("startfontface", startRule);
    
        //check for use of "font-size"
        parser.addListener("property", function(event){
            var name = event.property.toString().toLowerCase(),
                value = event.value.parts[0].value;

            if (name == "text-indent" && value < -99){
                textIndent = true;
            } else if (name == "direction" && value == "ltr"){
                textIndent = false;
            }
        });

        parser.addListener("endrule", endRule);
        parser.addListener("endfontface", endRule);     

    }

});