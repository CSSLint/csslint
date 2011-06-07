/*
 * Rule: Avoid too many @font-face declarations in the same stylesheet.
 */
CSSLint.addRule({

    //rule information
    name: "font-faces",
    desc: "Too many different web fonts in the same stylesheet.",
    
    //initialization
    init: function(parser, reporter){
    
        var count = 0;
    
        
        parser.addListener("startfontface", function(event){
            count++;
        });

        parser.addListener("endstylesheet", function(event){
            if (count > 5){
                reporter.rollupWarn("Too many @font-face declarations (" + count + ")");
            }
        });        
    }

});