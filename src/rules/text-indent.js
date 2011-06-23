/*
 * Rule: Don't use text-indent for image replacement if you need to support rtl. 
 * 
 */
/*
 * Should we be checking for rtl/ltr?
 */
CSSLint.addRule({

    //rule information
    id: "text-indent",
    name: "Text Indent",
    desc: "Checks for text indent less than -99px",
    browsers: "All",
    
    //initialization
    init: function(parser, reporter){
        var rule = this;
    
        //check for use of "font-size"
        parser.addListener("property", function(event){
            var name = event.property,
                value = event.value;

            if (name == "text-indent" && value < -99){
                reporter.warn("Negative text-indent doesn't work well with RTL. If you use text-indent for image replacement explicitly set text-direction for that item to ltr.", name.line, name.col, rule);
            }
        });
    }

});